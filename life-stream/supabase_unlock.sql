
-- 🔓 OPERATION UNLOCK: RESTORE ACCESS (Part 2)
-- Run this in Supabase SQL Editor to restore writing capabilities.

-- 1. DISABLE Blocking Policies
-- Note: This makes the API work immediately, but is less secure long-term.
alter table tasks disable row level security;
alter table entries disable row level security;

-- 2. Verify Data IS There
select count(*) as task_count from tasks;
select count(*) as entry_count from entries;

-- 3. Check for old tables (todos, items)
select count(*) as todo_count from pg_tables where tablename = 'todos';
