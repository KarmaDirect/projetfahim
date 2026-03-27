-- ============================================
-- Motion Planner - Migration Fix
-- Run on EXISTING database to fix all issues
-- ============================================

-- ============================================
-- 1. Create is_admin() security definer function
--    This avoids infinite recursion in RLS policies
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
-- 2. Fix role check constraint to include 'partner'
-- ============================================
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'client', 'partner'));

-- ============================================
-- 3. Fix handle_new_user() to include company
-- ============================================
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

-- Recreate trigger (idempotent)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 4. Fix recursive RLS policies on profiles
--    Drop old policies that query profiles directly,
--    recreate using is_admin()
-- ============================================

-- profiles: admin select
drop policy if exists "Admin can view all profiles" on public.profiles;
create policy "Admin can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- ============================================
-- 5. Fix recursive RLS policies on settings
-- ============================================

drop policy if exists "Admin can update settings" on public.settings;
create policy "Admin can update settings"
  on public.settings for update
  using (public.is_admin());

-- ============================================
-- 6. Fix recursive RLS policies on orders
-- ============================================

drop policy if exists "Admin can view all orders" on public.orders;
create policy "Admin can view all orders"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "Admin can update orders" on public.orders;
create policy "Admin can update orders"
  on public.orders for update
  using (public.is_admin());

-- ============================================
-- 7. Create messages table
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

-- Messages RLS policies
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

-- Add messages to realtime (ignore if already added)
do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then
  null;
end;
$$;

-- ============================================
-- 8. Fix existing data
-- ============================================

-- Update client profile to set company
update public.profiles
  set company = 'Studio Créatif'
  where email = 'client@fahimae.com';

-- ============================================
-- 9. NOTE: Orphaned auth user partenaire@fahimae.com
--    (id: 921dfeed-721e-426b-8d80-508af335d4b0)
--
--    Cannot delete auth.users rows via SQL in Supabase
--    (the auth schema is managed by GoTrue).
--    To clean up:
--      1. Delete via Supabase Dashboard > Authentication > Users
--      2. Or use the Admin API:
--         supabase.auth.admin.deleteUser('921dfeed-721e-426b-8d80-508af335d4b0')
--      3. Then recreate the partner user via the API with
--         correct metadata (role: 'partner', company, full_name)
-- ============================================
