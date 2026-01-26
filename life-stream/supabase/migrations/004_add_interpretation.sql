-- Add interpretation column to dreams table
ALTER TABLE dreams 
ADD COLUMN IF NOT EXISTS interpretation JSONB;

-- Comment on column
COMMENT ON COLUMN dreams.interpretation IS 'Stores the AI analysis/interpretation as a JSON array of strings';
