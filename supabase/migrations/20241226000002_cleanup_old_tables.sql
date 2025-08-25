-- Remove old normalized tables (replaced by simplified admissions_data)

-- Drop old tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS public.grades CASCADE;
DROP TABLE IF EXISTS public.university_applications CASCADE;  
DROP TABLE IF EXISTS public.admission_submissions CASCADE;

-- Drop custom users table (redundant with Supabase auth.users)
DROP TABLE IF EXISTS public.users CASCADE;

-- The admissions_data table is the only one we need now
-- It contains all the data in JSONB format:
-- - university_attendance (TEXT)
-- - high_school (TEXT) 
-- - universities (JSONB) - replaces university_applications table
-- - grades (JSONB) - replaces grades table 