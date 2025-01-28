/*
  # Add default host user and profile

  1. Changes
    - Create a default host user in auth.users
    - Create corresponding profile in profiles table
    - This user will be used as the default host for spots during development

  2. Security
    - Maintains existing RLS policies
*/

-- Create the default user in auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'default@example.com',
  crypt('default-password-never-use-in-production', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Default Host"}',
  false,
  'authenticated'
);

-- Create the corresponding profile
INSERT INTO public.profiles (
  id,
  role,
  email,
  full_name,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'host',
  'default@example.com',
  'Default Host',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;