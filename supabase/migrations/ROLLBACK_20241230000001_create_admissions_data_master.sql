-- =====================================================
-- EMERGENCY ROLLBACK SCRIPT
-- 20241230000001_create_admissions_data_master
-- =====================================================
-- 
-- WARNING: This script will completely remove the master table system
-- Only run this if you need to rollback the master table implementation
--
-- Usage: supabase db reset --file ROLLBACK_20241230000001_create_admissions_data_master.sql
-- =====================================================

-- Safety check - require explicit confirmation
DO $$
BEGIN
  -- Check if we're in production and require extra confirmation
  IF current_database() LIKE '%prod%' OR current_database() LIKE '%production%' THEN
    RAISE EXCEPTION 'SAFETY GUARD: Rollback on production database requires manual override. Set environment variable ROLLBACK_CONFIRMED=true';
  END IF;
  
  -- Check if the environment variable is set
  IF current_setting('ROLLBACK_CONFIRMED', true) != 'true' THEN
    RAISE EXCEPTION 'SAFETY GUARD: Set ROLLBACK_CONFIRMED=true to proceed with rollback';
  END IF;
  
  RAISE NOTICE 'ROLLBACK CONFIRMED: Proceeding with master table rollback on database: %', current_database();
END $$;

-- Log the rollback attempt
INSERT INTO public.migration_rollback_log (migration_name, database_name, rollback_commands, status)
VALUES (
  'ROLLBACK_20241230000001_create_admissions_data_master',
  current_database(),
  ARRAY['ROLLBACK EXECUTED'],
  'ROLLING_BACK'
);

-- Step 1: Remove triggers first (to prevent new master records)
DROP TRIGGER IF EXISTS admissions_data_insert_trigger ON public.admissions_data;
DROP TRIGGER IF EXISTS admissions_data_update_trigger ON public.admissions_data;
DROP TRIGGER IF EXISTS admissions_data_delete_trigger ON public.admissions_data;

-- Step 2: Remove functions
DROP FUNCTION IF EXISTS public.handle_admissions_data_insert();
DROP FUNCTION IF EXISTS public.handle_admissions_data_update();
DROP FUNCTION IF EXISTS public.handle_admissions_data_delete();
DROP FUNCTION IF EXISTS public.get_next_version_number(UUID);

-- Step 3: Remove master table (this will also remove all master data)
DROP TABLE IF EXISTS public.admissions_data_master CASCADE;

-- Step 4: Clean up rollback log
UPDATE public.migration_rollback_log 
SET status = 'ROLLED_BACK'
WHERE migration_name = '20241230000001_create_admissions_data_master'
  AND database_name = current_database();

-- Final verification
DO $$
BEGIN
  -- Verify master table is gone
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admissions_data_master') THEN
    RAISE EXCEPTION 'ROLLBACK FAILED: Master table still exists';
  END IF;
  
  -- Verify triggers are gone
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname LIKE '%admissions_data%') THEN
    RAISE EXCEPTION 'ROLLBACK FAILED: Triggers still exist';
  END IF;
  
  -- Verify original table is intact
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admissions_data') THEN
    RAISE EXCEPTION 'ROLLBACK FAILED: Original admissions_data table missing';
  END IF;
  
  RAISE NOTICE 'ROLLBACK COMPLETED SUCCESSFULLY: Master table system removed, original table intact';
END $$;
