-- =============================================
-- SecureVPN — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. ROLES
create table if not exists public.roles (
  id   bigint primary key generated always as identity,
  name varchar(255) not null unique
);

insert into public.roles (name) values ('admin'), ('user')
  on conflict do nothing;

-- 2. USERS (linked to auth.users)
create table if not exists public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  role_id    bigint references public.roles(id) on delete set null default 2,
  login      varchar(255),
  email      varchar(255),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- trigger: auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_users_updated on public.users;
create trigger on_users_updated
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- 3. TARIFFS
create table if not exists public.tariffs (
  id            bigint primary key generated always as identity,
  name          varchar(255) not null,
  price         decimal(10,2) not null default 0,
  devices_limit int not null default 1,
  speed_limit   varchar(50),
  data_count    varchar(50)
);

insert into public.tariffs (name, price, devices_limit, speed_limit, data_count) values
  ('Basic',    0,    1, '100 Mbps',  '3 GB'),
  ('Pro',      299,  5, '950 Mbps',  'Unlimited'),
  ('Business', 799, 10, '950 Mbps',  'Unlimited')
  on conflict do nothing;

-- 4. SUBSCRIPTIONS
create table if not exists public.subscriptions (
  id          bigint primary key generated always as identity,
  user_id     uuid references public.users(id) on delete cascade,
  tariff_id   bigint references public.tariffs(id) on delete set null,
  status      varchar(50) default 'active',
  start_date  date default current_date,
  end_date    date,
  auto_renew  boolean default true,
  created_at  timestamptz default now()
);

-- 5. SERVERS
create table if not exists public.servers (
  id         bigint primary key generated always as identity,
  country    varchar(255) not null,
  city       varchar(255) not null,
  ip_address varchar(45) not null unique,
  load       int default 0 check (load between 0 and 100),
  is_active  boolean default true
);

insert into public.servers (country, city, ip_address, load, is_active) values
  ('Germany',       'Frankfurt',  '192.168.1.1',   23, true),
  ('Netherlands',   'Amsterdam',  '192.168.1.2',   41, true),
  ('United States', 'New York',   '192.168.1.3',   67, true),
  ('Japan',         'Tokyo',      '192.168.1.4',   15, true),
  ('Singapore',     'Singapore',  '192.168.1.5',   55, true)
  on conflict do nothing;

-- 6. CONNECTIONS
create table if not exists public.connections (
  id           bigint primary key generated always as identity,
  server_id    bigint references public.servers(id) on delete set null,
  user_id      uuid references public.users(id) on delete cascade,
  start_time   timestamptz default now(),
  end_time     timestamptz,
  traffic_sent bigint default 0,
  traffic_recv bigint default 0
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.connections enable row level security;
alter table public.tariffs enable row level security;
alter table public.servers enable row level security;
alter table public.roles enable row level security;

-- Roles: readable by all
create policy "roles_read" on public.roles for select using (true);

-- Tariffs: readable by all, editable by admin
create policy "tariffs_read" on public.tariffs for select using (true);
create policy "tariffs_admin" on public.tariffs for all
  using (exists (select 1 from public.users where id = auth.uid() and role_id = 1));

-- Servers: readable by all, editable by admin
create policy "servers_read" on public.servers for select using (true);
create policy "servers_admin" on public.servers for all
  using (exists (select 1 from public.users where id = auth.uid() and role_id = 1));

-- Users: own profile + admin sees all
create policy "users_own" on public.users for select
  using (id = auth.uid() or exists (select 1 from public.users where id = auth.uid() and role_id = 1));
create policy "users_update_own" on public.users for update
  using (id = auth.uid());
create policy "users_delete_own" on public.users for delete
  using (id = auth.uid());
create policy "users_insert" on public.users for insert
  with check (id = auth.uid());
create policy "users_admin_all" on public.users for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role_id = 1));

-- Subscriptions: own + admin
create policy "subscriptions_own" on public.subscriptions for select
  using (user_id = auth.uid() or exists (select 1 from public.users where id = auth.uid() and role_id = 1));
create policy "subscriptions_admin" on public.subscriptions for all
  using (exists (select 1 from public.users where id = auth.uid() and role_id = 1));

-- Connections: own + admin
create policy "connections_own" on public.connections for select
  using (user_id = auth.uid() or exists (select 1 from public.users where id = auth.uid() and role_id = 1));
create policy "connections_insert_own" on public.connections for insert
  with check (user_id = auth.uid());
