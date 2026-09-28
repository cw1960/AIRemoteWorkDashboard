-- Guard: every table in the public schema must have row-level security on.
-- Runs with `pnpm db:test` (pgTAP). Per-table policy tests live beside it.
begin;
create extension if not exists pgtap with schema extensions;

select plan(1);

select is_empty(
  $$
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind in ('r', 'p')
      and not c.relrowsecurity
  $$,
  'every public table has row-level security enabled'
);

select * from finish();
rollback;
