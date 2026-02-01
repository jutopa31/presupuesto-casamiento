alter table public.bebidas
  add column if not exists comprada boolean not null default false;
