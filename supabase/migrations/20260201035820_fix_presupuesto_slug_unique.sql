alter table public.presupuestos
  drop constraint if exists presupuestos_slug_key;

create unique index if not exists presupuestos_user_slug_unique
  on public.presupuestos (user_id, slug);