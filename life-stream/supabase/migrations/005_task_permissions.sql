-- Force Fix for Task RLS Policies
-- This migration ensures Guests (anon role) can definitely Create/Read/Update/Delete tasks.

-- 1. Enable RLS (Ensure it's on)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- 2. Drop potential conflicting policies (Clean Slate)
DROP POLICY IF EXISTS "Anon can do anything with tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- 3. Create the Permissive "Guest Mode" Policy
CREATE POLICY "Anon can do anything with tasks" ON tasks
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Verify Column Type (If user_id is UUID, this comment reminds us; if TEXT, it's fine)
-- Note: Our code now sends a UUID for guests ('00000000-0000-0000-0000-000000000000') suitable for both types.
