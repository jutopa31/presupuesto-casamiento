alter table public.presupuestos
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.bebidas
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

update public.bebidas
set user_id = p.user_id
from public.presupuestos p
where bebidas.presupuesto_id = p.id and bebidas.user_id is null;

delete from public.bebidas where user_id is null;
delete from public.presupuestos where user_id is null;

alter table public.presupuestos
  alter column user_id set not null;

alter table public.bebidas
  alter column user_id set not null;

alter table public.presupuestos enable row level security;
alter table public.bebidas enable row level security;

drop policy if exists "anon_all_presupuestos" on public.presupuestos;
drop policy if exists "anon_all_bebidas" on public.bebidas;

create policy "user_presupuestos_select" on public.presupuestos
  for select
  using (auth.uid() = user_id);

create policy "user_presupuestos_insert" on public.presupuestos
  for insert
  with check (auth.uid() = user_id);

create policy "user_presupuestos_update" on public.presupuestos
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_presupuestos_delete" on public.presupuestos
  for delete
  using (auth.uid() = user_id);

create policy "user_bebidas_select" on public.bebidas
  for select
  using (auth.uid() = user_id);

create policy "user_bebidas_insert" on public.bebidas
  for insert
  with check (auth.uid() = user_id);

create policy "user_bebidas_update" on public.bebidas
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_bebidas_delete" on public.bebidas
  for delete
  using (auth.uid() = user_id);