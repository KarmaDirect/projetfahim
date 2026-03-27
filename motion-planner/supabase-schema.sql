-- ============================================
-- Motion Planner - Database Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  company text default '',
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admin can view all profiles"
  on public.profiles for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================
-- SETTINGS TABLE (Admin only)
-- ============================================
create table public.settings (
  id uuid primary key default uuid_generate_v4(),
  price_per_second numeric not null default 5.00,
  seconds_per_day numeric not null default 30,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "Anyone can read settings"
  on public.settings for select
  using (true);

create policy "Admin can update settings"
  on public.settings for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Insert default settings
insert into public.settings (price_per_second, seconds_per_day)
values (5.00, 30);

-- ============================================
-- ORDERS TABLE
-- ============================================
create table public.orders (
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
create policy "Clients can view own orders"
  on public.orders for select
  using (auth.uid() = client_id);

create policy "Admin can view all orders"
  on public.orders for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Clients can create orders"
  on public.orders for insert
  with check (auth.uid() = client_id);

create policy "Admin can update orders"
  on public.orders for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Clients can update own pending orders"
  on public.orders for update
  using (auth.uid() = client_id and status = 'pending');

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  read boolean not null default false,
  order_id uuid references public.orders(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Anyone can insert notifications"
  on public.notifications for insert
  with check (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'client')
  );
  return new;
end;
$$ language plpgsql security definer;

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

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger update_orders_updated_at
  before update on public.orders
  for each row execute procedure public.update_updated_at();

create trigger update_settings_updated_at
  before update on public.settings
  for each row execute procedure public.update_updated_at();

-- ============================================
-- REALTIME
-- ============================================
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.notifications;
