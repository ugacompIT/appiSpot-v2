/*
  # Update spots table RLS policies

  1. Changes
    - Drop existing insert policy
    - Create new insert policy allowing anyone to create spots
    - Maintain existing select policy

  2. Security
    - Allow public spot creation
    - Maintain public read access
*/

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Hosts can insert their own spots" ON spots;

-- Create new insert policy allowing anyone to create spots
CREATE POLICY "Anyone can create spots"
  ON spots FOR INSERT
  WITH CHECK (true);