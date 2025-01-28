/*
  # Add type column to spots table

  1. Changes
    - Add type column to spots table to store the spot type (venue, studio, office, etc.)
    - Set default type as 'venue'

  2. Security
    - Maintain existing RLS policies
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spots' AND column_name = 'type'
  ) THEN
    ALTER TABLE spots ADD COLUMN type text DEFAULT 'venue';
  END IF;
END $$;