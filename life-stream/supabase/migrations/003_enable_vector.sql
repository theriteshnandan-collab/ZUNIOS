-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Add embedding column to dreams table
-- We use 384 dimensions for all-MiniLM-L6-v2
alter table dreams add column if not exists embedding vector(384);

-- Create a function to search for dreams
create or replace function match_dreams (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  theme text,
  mood text,
  category text,
  created_at timestamptz,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    dreams.id,
    dreams.content,
    dreams.theme,
    dreams.mood,
    dreams.category,
    dreams.created_at,
    1 - (dreams.embedding <=> query_embedding) as similarity
  from dreams
  where 1 - (dreams.embedding <=> query_embedding) > match_threshold
  order by dreams.embedding <=> query_embedding
  limit match_count;
end;
$$;
