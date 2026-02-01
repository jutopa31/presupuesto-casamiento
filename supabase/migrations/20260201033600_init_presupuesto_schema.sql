create extension if not exists "pgcrypto";

create table if not exists public.presupuestos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  presupuesto_objetivo numeric not null default 0,
  moneda text not null default 'ARS',
  fecha_evento date,
  cantidad_invitados integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bebidas (
  id uuid primary key default gen_random_uuid(),
  presupuesto_id uuid not null references public.presupuestos(id) on delete cascade,
  nombre text not null,
  categoria text not null,
  cantidad integer not null default 1,
  precio_unitario numeric not null default 0,
  lugar_precio text not null default '',
  comentarios text not null default '',
  fecha_actualizacion timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.bebidas
  add constraint bebidas_categoria_check
  check (categoria in ('destilado', 'vino', 'cerveza', 'sin-alcohol', 'otro'));

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger presupuestos_updated_at
before update on public.presupuestos
for each row execute function public.set_updated_at();

create or replace function public.set_fecha_actualizacion()
returns trigger as $$
begin
  new.fecha_actualizacion = now();
  return new;
end;
$$ language plpgsql;

create trigger bebidas_fecha_actualizacion
before update on public.bebidas
for each row execute function public.set_fecha_actualizacion();

alter table public.presupuestos enable row level security;
create policy "anon_all_presupuestos" on public.presupuestos
  for all
  using (true)
  with check (true);

alter table public.bebidas enable row level security;
create policy "anon_all_bebidas" on public.bebidas
  for all
  using (true)
  with check (true);

insert into public.presupuestos (slug)
values ('default')
on conflict (slug) do nothing;