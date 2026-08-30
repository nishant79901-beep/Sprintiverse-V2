alter table public.customers add column if not exists has_order boolean not null default false;

create table if not exists public.workspace_integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  provider text not null check (provider in ('shopify','woocommerce')),
  enabled boolean not null default false,
  store_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id, provider)
);

alter table public.workspace_integrations enable row level security;

drop policy if exists integrations_member_select on public.workspace_integrations;
drop policy if exists integrations_member_insert on public.workspace_integrations;
drop policy if exists integrations_member_update on public.workspace_integrations;

create policy integrations_member_select on public.workspace_integrations
for select to authenticated
using (exists (select 1 from public.workspace_members m where m.workspace_id = workspace_integrations.workspace_id and m.user_id = (select auth.uid())));

create policy integrations_member_insert on public.workspace_integrations
for insert to authenticated
with check (exists (select 1 from public.workspace_members m where m.workspace_id = workspace_integrations.workspace_id and m.user_id = (select auth.uid())));

create policy integrations_member_update on public.workspace_integrations
for update to authenticated
using (exists (select 1 from public.workspace_members m where m.workspace_id = workspace_integrations.workspace_id and m.user_id = (select auth.uid())))
with check (exists (select 1 from public.workspace_members m where m.workspace_id = workspace_integrations.workspace_id and m.user_id = (select auth.uid())));

create index if not exists idx_workspace_integrations_workspace on public.workspace_integrations(workspace_id);
create index if not exists idx_customers_has_order on public.customers(workspace_id, has_order);
