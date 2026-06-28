create extension if not exists pgcrypto;

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  plan_id text not null check (plan_id in ('3m', '1y', 'lifetime')),
  customer_email text not null,
  stripe_payment_intent_id text unique,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  status text not null default 'active' check (status in ('active', 'canceled', 'revoked')),
  pending_months integer not null default 0,
  redeemed_at timestamptz,
  expires_at timestamptz,
  lifetime boolean not null default false,
  last_invoice_id text,
  email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now(),
  result text not null,
  error text
);

create table if not exists public.license_activations (
  id uuid primary key default gen_random_uuid(),
  license_id uuid not null references public.licenses(id) on delete cascade,
  device_id_hash text not null,
  activation_token_hash text not null unique,
  activated_at timestamptz not null default now(),
  last_check_at timestamptz not null default now(),
  unique (license_id, device_id_hash)
);

create index if not exists licenses_subscription_idx on public.licenses (stripe_subscription_id);
create index if not exists licenses_payment_intent_idx on public.licenses (stripe_payment_intent_id);
create index if not exists license_activations_license_idx on public.license_activations (license_id);
