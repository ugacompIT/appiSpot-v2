/*
  # Add square footage to spots table

  1. Changes
    - Add `square_footage` column to spots table
    - Column is nullable to maintain compatibility with existing records
    - Integer type for whole number square footage values
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spots' AND column_name = 'square_footage'
  ) THEN
    ALTER TABLE spots ADD COLUMN square_footage integer;
  END IF;
END $$;