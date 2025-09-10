-- =====================================================
-- PRE-MIGRATION SAFETY CHECK
-- Run this BEFORE applying the master table migration
-- =====================================================

-- Check 1: Verify we're not on production
SELECT 
  CASE 
    WHEN current_database() LIKE '%prod%' OR current_database() LIKE '%production%' 
    THEN '❌ PRODUCTION DATABASE DETECTED - DO NOT RUN MIGRATION'
    ELSE '✅ Safe to proceed - Not a production database'
  END as database_safety_check,
  current_database() as database_name;

-- Check 2: Verify admissions_data table exists and has expected structure
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admissions_data' AND table_schema = 'public')
    THEN '✅ admissions_data table exists'
    ELSE '❌ admissions_data table NOT FOUND'
  END as table_existence_check;

-- Check 3: Count existing records
SELECT 
  COUNT(*) as existing_records,
  COUNT(DISTINCT user_id) as unique_users
FROM public.admissions_data;

-- Check 4: Check for existing master table (should not exist)
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admissions_data_master' AND table_schema = 'public')
    THEN '❌ admissions_data_master already exists - migration may have been run'
    ELSE '✅ admissions_data_master does not exist - safe to proceed'
  END as master_table_check;

-- Check 5: Verify database permissions
SELECT 
  CASE 
    WHEN has_table_privilege('public.admissions_data', 'SELECT') 
    THEN '✅ SELECT permission on admissions_data'
    ELSE '❌ NO SELECT permission on admissions_data'
  END as select_permission,
  CASE 
    WHEN has_table_privilege('public.admissions_data', 'INSERT') 
    THEN '✅ INSERT permission on admissions_data'
    ELSE '❌ NO INSERT permission on admissions_data'
  END as insert_permission;

-- Check 6: Check for existing triggers (should not exist)
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname LIKE '%admissions_data%')
    THEN '❌ Existing triggers found - may conflict with migration'
    ELSE '✅ No conflicting triggers found'
  END as trigger_check;

-- Check 7: Database size and available space (optional)
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as database_size,
  pg_size_pretty(pg_total_relation_size('public.admissions_data')) as admissions_data_size;

-- Summary
SELECT 
  'PRE-MIGRATION SAFETY CHECK COMPLETE' as status,
  NOW() as check_timestamp,
  current_database() as database_name,
  current_user as database_user;
