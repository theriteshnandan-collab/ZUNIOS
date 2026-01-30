-- 🏗️ OPERATION MNEMOSYNE: CREATE ENTRIES TABLE
-- Run this FIRST to fix the "relation does not exist" error.

create table if not exists entries (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  content text not null,
  theme text,
  mood text,
  image_url text,
  category text, -- 'dream', 'idea', 'journal'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  interpretation jsonb -- Stores the AI analysis array
);

-- Enable Row Level Security (RLS) is recommended (optional for now, but good practice)
alter table entries enable row level security;

-- Policy: Users can only see their own entries
create policy "Users can see own entries" on entries
  for select using (auth.uid()::text = user_id);

create policy "Users can insert own entries" on entries
  for insert with check (auth.uid()::text = user_id);

-- NOW you can run the Vector Setup script again.
