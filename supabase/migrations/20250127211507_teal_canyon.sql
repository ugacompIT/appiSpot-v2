/*
  # Add features to spots table

  1. Changes
    - Add features column to spots table to store spot amenities and features
    - Update existing spots to have default features value

  2. Security
    - Maintain existing RLS policies
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'spots' AND column_name = 'features'
  ) THEN
    ALTER TABLE spots ADD COLUMN features jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;