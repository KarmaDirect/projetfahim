-- ============================================
-- Motion Planner - Database Schema (Complete)
-- Idempotent: safe to run on a fresh database
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- HELPER FUNCTION: is_admin()
-- Security definer so it bypasses RLS
-- ============================================
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer stable;

-- ============================================
-- PROFILES TABLE
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  company text default '',
  role text not null default 'client' check (role in ('admin', 'client', 'partner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Drop existing policies if they exist, then recreate
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Admin can view all profiles" on public.profiles;
create policy "Admin can view all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================
-- SETTINGS TABLE (Admin only)
-- ============================================
create table if not exists public.settings (
  id uuid primary key default uuid_generate_v4(),
  price_per_second numeric not null default 5.00,
  seconds_per_day numeric not null default 30,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

drop policy if exists "Anyone can read settings" on public.settings;
create policy "Anyone can read settings"
  on public.settings for select
  using (true);

drop policy if exists "Admin can update settings" on public.settings;
create policy "Admin can update settings"
  on public.settings for update
  using (public.is_admin());

-- Insert default settings only if table is empty
insert into public.settings (price_per_second, seconds_per_day)
select 5.00, 30
where not exists (select 1 from public.settings);

-- ============================================
-- ORDERS TABLE
-- ============================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.profiles(id) on delete cascade not null,
  client_name text not null,
  project_name text not null,
  description text default '',
  seconds_ordered numeric not null check (seconds_ordered > 0),
  price_per_second numeric not null,
  total_price numeric generated always as (seconds_ordered * price_per_second) stored,
  production_days numeric not null,
  deadline date,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'rejected')),
  scheduled_start date,
  scheduled_end date,
  admin_notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Orders policies
drop policy if exists "Clients can view own orders" on public.orders;
create policy "Clients can view own orders"
  on public.orders for select
  using (auth.uid() = client_id);

drop policy if exists "Admin can view all orders" on public.orders;
create policy "Admin can view all orders"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "Clients can create orders" on public.orders;
create policy "Clients can create orders"
  on public.orders for insert
  with check (auth.uid() = client_id);

drop policy if exists "Admin can update orders" on public.orders;
create policy "Admin can update orders"
  on public.orders for update
  using (public.is_admin());

drop policy if exists "Clients can update own pending orders" on public.orders;
create policy "Clients can update own pending orders"
  on public.orders for update
  using (auth.uid() = client_id and status = 'pending');

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  read boolean not null default false,
  order_id uuid references public.orders(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

drop policy if exists "Anyone can insert notifications" on public.notifications;
create policy "Anyone can insert notifications"
  on public.notifications for insert
  with check (true);

-- ============================================
-- MESSAGES TABLE (Chat functionality)
-- ============================================
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Messages policies: users can see messages they sent or received
drop policy if exists "Users can view own messages" on public.messages;
create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Users can insert messages" on public.messages;
create policy "Users can insert messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

drop policy if exists "Receivers can mark messages as read" on public.messages;
create policy "Receivers can mark messages as read"
  on public.messages for update
  using (auth.uid() = receiver_id);

drop policy if exists "Admin can view all messages" on public.messages;
create policy "Admin can view all messages"
  on public.messages for select
  using (public.is_admin());

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup (includes company)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, company, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'company', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop and recreate trigger (idempotent)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update timestamp trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

drop trigger if exists update_orders_updated_at on public.orders;
create trigger update_orders_updated_at
  before update on public.orders
  for each row execute procedure public.update_updated_at();

drop trigger if exists update_settings_updated_at on public.settings;
create trigger update_settings_updated_at
  before update on public.settings
  for each row execute procedure public.update_updated_at();

-- ============================================
-- REALTIME
-- ============================================
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.messages;
