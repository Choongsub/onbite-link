begin;

-- Existing rows cannot be assigned safely to an authenticated owner. The
-- requested reset therefore removes them before the NOT NULL constraint.
delete from public.links;
delete from public.folders;

alter table public.links
  add column if not exists user_id uuid;

alter table public.folders
  add column if not exists user_id uuid;

alter table public.links
  alter column user_id set not null;

alter table public.folders
  alter column user_id set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'links_user_id_fkey'
      and conrelid = 'public.links'::regclass
  ) then
    alter table public.links
      add constraint links_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'folders_user_id_fkey'
      and conrelid = 'public.folders'::regclass
  ) then
    alter table public.folders
      add constraint folders_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end
$$;

create index if not exists links_user_id_idx on public.links using btree (user_id);
create index if not exists folders_user_id_idx on public.folders using btree (user_id);

-- Always derive ownership from the authenticated request instead of trusting
-- a client-provided user_id value.
create or replace function public.set_user_id_from_auth()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.user_id := (select auth.uid());
  if new.user_id is null then
    raise exception 'Authentication is required to create this row';
  end if;
  return new;
end;
$$;

drop trigger if exists links_set_user_id on public.links;
create trigger links_set_user_id
before insert on public.links
for each row execute function public.set_user_id_from_auth();

drop trigger if exists folders_set_user_id on public.folders;
create trigger folders_set_user_id
before insert on public.folders
for each row execute function public.set_user_id_from_auth();

alter table public.links enable row level security;
alter table public.folders enable row level security;

drop policy if exists links_select_own on public.links;
create policy links_select_own on public.links
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists links_insert_own on public.links;
create policy links_insert_own on public.links
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists links_update_own on public.links;
create policy links_update_own on public.links
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists links_delete_own on public.links;
create policy links_delete_own on public.links
  for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists folders_select_own on public.folders;
create policy folders_select_own on public.folders
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists folders_insert_own on public.folders;
create policy folders_insert_own on public.folders
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists folders_update_own on public.folders;
create policy folders_update_own on public.folders
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists folders_delete_own on public.folders;
create policy folders_delete_own on public.folders
  for delete to authenticated
  using ((select auth.uid()) = user_id);

commit;
