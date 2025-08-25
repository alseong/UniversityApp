-- Remove database triggers that try to insert into public.users table
-- These triggers were causing OAuth failures since we don't have a users table

-- Drop the triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Drop the functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();

-- Drop the users table if it exists (we're using auth.users directly)
DROP TABLE IF EXISTS public.users CASCADE; 