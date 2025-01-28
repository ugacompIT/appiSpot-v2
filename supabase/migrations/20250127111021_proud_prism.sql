/*
  # Initial Schema for appiSpot Platform

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to Supabase auth.users
      - Includes role (host/guest/admin)
    - `spots`
      - Stores venue/location information
      - Linked to host profiles
      - Includes details, pricing, capacity
    - `bookings`
      - Stores booking information
      - Links spots with guests
      - Includes payment status
    - `spot_images`
      - Stores images for spots
      - Linked to spots table
    
  2. Security
    - Enable RLS on all tables
    - Policies for proper access control
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('host', 'guest', 'admin');

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL DEFAULT 'guest',
  full_name text,
  email text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create spots table
CREATE TABLE spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  description text,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  capacity int NOT NULL,
  price_per_hour numeric(10,2) NOT NULL,
  amenities jsonb DEFAULT '[]',
  rules text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create spot_images table
CREATE TABLE spot_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id uuid REFERENCES spots(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id uuid REFERENCES spots(id) NOT NULL,
  guest_id uuid REFERENCES profiles(id) NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  payment_intent_id text,
  event_type text NOT NULL,
  guest_count int NOT NULL,
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Spots policies
CREATE POLICY "Spots are viewable by everyone"
  ON spots FOR SELECT
  USING (true);

CREATE POLICY "Hosts can insert their own spots"
  ON spots FOR INSERT
  WITH CHECK (
    auth.uid() = host_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'host'
    )
  );

CREATE POLICY "Hosts can update their own spots"
  ON spots FOR UPDATE
  USING (auth.uid() = host_id);

-- Spot images policies
CREATE POLICY "Spot images are viewable by everyone"
  ON spot_images FOR SELECT
  USING (true);

CREATE POLICY "Hosts can manage their spot images"
  ON spot_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM spots
      WHERE spots.id = spot_images.spot_id
      AND spots.host_id = auth.uid()
    )
  );

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = guest_id
    OR EXISTS (
      SELECT 1 FROM spots
      WHERE spots.id = bookings.spot_id
      AND spots.host_id = auth.uid()
    )
  );

CREATE POLICY "Guests can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (
    auth.uid() = guest_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'guest'
    )
  );

-- Create functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();