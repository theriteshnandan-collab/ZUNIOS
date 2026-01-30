-- 🏗️ OPERATION MNEMOSYNE: MASTER FIX & DATA RESCUE
-- Run this in Supabase SQL Editor to fix connections and Restore Data.

-- 1. Enable Extensions
create extension if not exists vector;

-- 2. SCHEMAS: Create Tables if they don't exist

-- ENTRIES (The New Home for Thoughts/Dreams)
create table if not exists entries (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  content text not null,
  theme text,
  mood text,
  image_url text,
  category text, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  interpretation jsonb,
  embedding vector(384)
);

-- TASKS (Mission Objectives)
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  content text not null,
  status text default 'todo',
  priority text default 'medium',
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  source_entry_id uuid,
  embedding vector(384)
);

-- 3. DATA RESCUE: Migrate from old 'dreams' table if it exists
do $$
begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'dreams') then
    -- Copy data from dreams to entries
    insert into entries (id, user_id, content, theme, mood, image_url, category, created_at, interpretation)
    select id, user_id, content, theme, mood, image_url, category, created_at, interpretation
    from dreams
    on conflict (id) do nothing;
    
    raise notice 'Data migrated from dreams to entries successfully.';
  end if;
end
$$;

-- 4. SECURITY: Enable Row Level Security
alter table tasks enable row level security;
alter table entries enable row level security;

-- 5. POLICIES: Allow Access
-- (Dropping existing policies first to avoiding duplication errors)
drop policy if exists "Users can see own tasks" on tasks;
drop policy if exists "Users can insert own tasks" on tasks;
drop policy if exists "Users can update own tasks" on tasks;
drop policy if exists "Users can delete own tasks" on tasks;

drop policy if exists "Users can see own entries" on entries;
drop policy if exists "Users can insert own entries" on entries;

-- Re-create Policies
create policy "Users can see own tasks" on tasks for select using (auth.uid()::text = user_id);
create policy "Users can insert own tasks" on tasks for insert with check (auth.uid()::text = user_id);
create policy "Users can update own tasks" on tasks for update using (auth.uid()::text = user_id);
create policy "Users can delete own tasks" on tasks for delete using (auth.uid()::text = user_id);

create policy "Users can see own entries" on entries for select using (auth.uid()::text = user_id);
create policy "Users can insert own entries" on entries for insert with check (auth.uid()::text = user_id);

-- 6. INTELLIGENCE: Neural Search Function
create or replace function match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  similarity float,
  type text
)
language plpgsql
as $$
begin
  return query
  select
    entries.id,
    entries.content,
    1 - (entries.embedding <=> query_embedding) as similarity,
    'entry' as type
  from entries
  where 1 - (entries.embedding <=> query_embedding) > match_threshold
  
  union all
  
  select
    tasks.id,
    tasks.content,
    1 - (tasks.embedding <=> query_embedding) as similarity,
    'task' as type
  from tasks
  where 1 - (tasks.embedding <=> query_embedding) > match_threshold
  
  order by similarity desc
  limit match_count;
end;
$$;
