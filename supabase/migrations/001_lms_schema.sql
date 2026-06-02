-- Supabase SQL Editor → New query → Run

create extension if not exists "pgcrypto";

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  customer_id text unique not null,
  full_name text not null,
  cnic text unique not null,
  mobile_number text not null,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists financing_applications (
  id uuid primary key default gen_random_uuid(),
  application_no text unique not null,
  customer_id uuid not null references customers(id) on delete cascade,
  financing_type text not null,
  financing_amount numeric(16, 2) not null,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create index if not exists idx_financing_status on financing_applications(status);

alter table customers enable row level security;
alter table financing_applications enable row level security;

-- API routes use service_role key (server only). Block anonymous direct table access:
create policy "deny anon customers" on customers for all to anon using (false);
create policy "deny anon financing" on financing_applications for all to anon using (false);
