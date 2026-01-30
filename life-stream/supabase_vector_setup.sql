-- 🧠 OPERATION MNEMOSYNE: DATABASE UPGRADE (FIXED)
-- Run this in your Supabase SQL Editor.

-- 1. Enable the Vector Extension (The Mathematical Core)
create extension if not exists vector;

-- 2. Add Memory Slots to Entries (Dreams/Journal)
-- using 384 dimensions for all-MiniLM-L6-v2 (Speed/Efficiency Balance)
alter table entries 
add column if not exists embedding vector(384);

-- 3. Add Memory Slots to Tasks (Mission Objectives)
alter table tasks 
add column if not exists embedding vector(384);

-- 4. Create the Neural Recall Function (RPC)
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
  
  -- Search Dreams/Journal
  select
    entries.id,
    entries.content,
    1 - (entries.embedding <=> query_embedding) as similarity,
    'entry' as type
  from entries
  where 1 - (entries.embedding <=> query_embedding) > match_threshold
  
  union all
  
  -- Search Tasks
  select
    tasks.id,
    tasks.content,
    1 - (tasks.embedding <=> query_embedding) as similarity,
    'task' as type
  from tasks
  where 1 - (tasks.embedding <=> query_embedding) > match_threshold
  
  -- Order by strongest match
  order by similarity desc
  limit match_count;
end;
$$;
