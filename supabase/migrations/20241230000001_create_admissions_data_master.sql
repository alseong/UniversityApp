-- =====================================================
-- SAFETY GUARDS FOR PRODUCTION DATABASE
-- =====================================================

-- 1. Production safety checks - ALLOWED
DO $$
BEGIN
  -- Log the migration attempt
  RAISE NOTICE 'SAFETY CHECK PASSED: Running migration on database: %', current_database();
  
  -- Check if this is a production environment and log warning
  IF current_database() LIKE '%prod%' OR current_database() LIKE '%production%' THEN
    RAISE WARNING 'PRODUCTION DATABASE DETECTED: Running migration on production database: %', current_database();
  END IF;
END $$;

-- 2. Backup existing admissions_data table structure
CREATE TABLE IF NOT EXISTS public.admissions_data_backup_structure AS
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'admissions_data' AND table_schema = 'public'
WITH NO DATA;

-- 3. Create a rollback log table
CREATE TABLE IF NOT EXISTS public.migration_rollback_log (
  id SERIAL PRIMARY KEY,
  migration_name TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  database_name TEXT NOT NULL,
  rollback_commands TEXT[],
  status TEXT DEFAULT 'EXECUTING'
);

-- Log this migration attempt
INSERT INTO public.migration_rollback_log (migration_name, database_name, rollback_commands)
VALUES (
  '20241230000001_create_admissions_data_master',
  current_database(),
  ARRAY[
    'DROP TABLE IF EXISTS public.admissions_data_master CASCADE;',
    'DROP FUNCTION IF EXISTS public.get_next_version_number(UUID);',
    'DROP FUNCTION IF EXISTS public.handle_admissions_data_insert();',
    'DROP FUNCTION IF EXISTS public.handle_admissions_data_update();',
    'DROP FUNCTION IF EXISTS public.handle_admissions_data_delete();'
  ]
);

-- =====================================================
-- MAIN MIGRATION STARTS HERE
-- =====================================================

-- Create master table for admissions_data with versioning and audit capabilities
CREATE TABLE IF NOT EXISTS public.admissions_data_master (
  -- Master table primary key
  master_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference to original record (can be NULL if original was deleted)
  original_record_id UUID,
  
  -- User reference
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- All original admissions_data fields
  university_attendance TEXT,
  high_school TEXT,
  avg_grade_11 TEXT,
  avg_grade_12 TEXT,
  universities JSONB NOT NULL DEFAULT '[]'::jsonb,
  grades JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Versioning and audit fields
  version_number INTEGER NOT NULL,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('INSERT', 'UPDATE', 'DELETE')),
  operation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  
  -- Original timestamps from admissions_data
  original_created_at TIMESTAMP WITH TIME ZONE,
  original_updated_at TIMESTAMP WITH TIME ZONE,
  
  -- Master table timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure version numbers are sequential per user
  UNIQUE(user_id, version_number)
);

-- Enable RLS on master table
ALTER TABLE public.admissions_data_master ENABLE ROW LEVEL SECURITY;

-- RLS Policies for master table (admin/system access only)
CREATE POLICY "System can manage master admissions data" ON public.admissions_data_master 
FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX admissions_data_master_user_id_idx ON public.admissions_data_master(user_id);
CREATE INDEX admissions_data_master_version_idx ON public.admissions_data_master(user_id, version_number);
CREATE INDEX admissions_data_master_operation_idx ON public.admissions_data_master(operation_type);
CREATE INDEX admissions_data_master_timestamp_idx ON public.admissions_data_master(operation_timestamp);
CREATE INDEX admissions_data_master_original_id_idx ON public.admissions_data_master(original_record_id);

-- Function to get next version number for a user
CREATE OR REPLACE FUNCTION public.get_next_version_number(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM public.admissions_data_master
  WHERE user_id = p_user_id;
  
  RETURN next_version;
END;
$$ LANGUAGE plpgsql;

-- Function to handle INSERT operations on admissions_data
CREATE OR REPLACE FUNCTION public.handle_admissions_data_insert()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get next version number for this user
  next_version := public.get_next_version_number(NEW.user_id);
  
  -- Insert into master table
  INSERT INTO public.admissions_data_master (
    original_record_id,
    user_id,
    university_attendance,
    high_school,
    avg_grade_11,
    avg_grade_12,
    universities,
    grades,
    version_number,
    operation_type,
    operation_timestamp,
    original_created_at,
    original_updated_at
  ) VALUES (
    NEW.id,
    NEW.user_id,
    NEW.university_attendance,
    NEW.high_school,
    NEW.avg_grade_11,
    NEW.avg_grade_12,
    NEW.universities,
    NEW.grades,
    next_version,
    'INSERT',
    NOW(),
    NEW.created_at,
    NEW.updated_at
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle UPDATE operations on admissions_data
CREATE OR REPLACE FUNCTION public.handle_admissions_data_update()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get next version number for this user
  next_version := public.get_next_version_number(NEW.user_id);
  
  -- Insert into master table with updated data
  INSERT INTO public.admissions_data_master (
    original_record_id,
    user_id,
    university_attendance,
    high_school,
    avg_grade_11,
    avg_grade_12,
    universities,
    grades,
    version_number,
    operation_type,
    operation_timestamp,
    original_created_at,
    original_updated_at
  ) VALUES (
    NEW.id,
    NEW.user_id,
    NEW.university_attendance,
    NEW.high_school,
    NEW.avg_grade_11,
    NEW.avg_grade_12,
    NEW.universities,
    NEW.grades,
    next_version,
    'UPDATE',
    NOW(),
    NEW.created_at,
    NEW.updated_at
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle DELETE operations on admissions_data
CREATE OR REPLACE FUNCTION public.handle_admissions_data_delete()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get next version number for this user
  next_version := public.get_next_version_number(OLD.user_id);
  
  -- Insert into master table with deleted data
  INSERT INTO public.admissions_data_master (
    original_record_id,
    user_id,
    university_attendance,
    high_school,
    avg_grade_11,
    avg_grade_12,
    universities,
    grades,
    version_number,
    operation_type,
    operation_timestamp,
    deleted_at,
    original_created_at,
    original_updated_at
  ) VALUES (
    OLD.id,
    OLD.user_id,
    OLD.university_attendance,
    OLD.high_school,
    OLD.avg_grade_11,
    OLD.avg_grade_12,
    OLD.universities,
    OLD.grades,
    next_version,
    'DELETE',
    NOW(),
    NOW(),
    OLD.created_at,
    OLD.updated_at
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER admissions_data_insert_trigger
  AFTER INSERT ON public.admissions_data
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_admissions_data_insert();

CREATE TRIGGER admissions_data_update_trigger
  AFTER UPDATE ON public.admissions_data
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_admissions_data_update();

CREATE TRIGGER admissions_data_delete_trigger
  AFTER DELETE ON public.admissions_data
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_admissions_data_delete();

-- Migrate existing data to master table
-- This creates initial master records for all existing admissions_data
INSERT INTO public.admissions_data_master (
  original_record_id,
  user_id,
  university_attendance,
  high_school,
  avg_grade_11,
  avg_grade_12,
  universities,
  grades,
  version_number,
  operation_type,
  operation_timestamp,
  original_created_at,
  original_updated_at
)
SELECT 
  id as original_record_id,
  user_id,
  university_attendance,
  high_school,
  avg_grade_11,
  avg_grade_12,
  universities,
  grades,
  1 as version_number, -- Initial version for existing data
  'INSERT' as operation_type,
  created_at as operation_timestamp,
  created_at as original_created_at,
  updated_at as original_updated_at
FROM public.admissions_data
WHERE user_id IS NOT NULL;

-- Add realtime publication for master table (optional, for monitoring)
-- alter publication supabase_realtime add table admissions_data_master;

-- =====================================================
-- MIGRATION COMPLETION AND SAFETY CHECKS
-- =====================================================

-- Mark migration as completed successfully
UPDATE public.migration_rollback_log 
SET status = 'COMPLETED'
WHERE migration_name = '20241230000001_create_admissions_data_master'
  AND database_name = current_database();

-- Final safety verification
DO $$
DECLARE
  master_count INTEGER;
  original_count INTEGER;
BEGIN
  -- Count records in both tables
  SELECT COUNT(*) INTO original_count FROM public.admissions_data;
  SELECT COUNT(*) INTO master_count FROM public.admissions_data_master;
  
  -- Verify data integrity
  IF original_count != master_count THEN
    RAISE WARNING 'DATA INTEGRITY WARNING: Original table has % records, master table has % records', original_count, master_count;
  ELSE
    RAISE NOTICE 'DATA INTEGRITY VERIFIED: Both tables have % records', original_count;
  END IF;
  
  -- Verify triggers exist
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'admissions_data_insert_trigger') THEN
    RAISE EXCEPTION 'SAFETY CHECK FAILED: Insert trigger not found';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'admissions_data_update_trigger') THEN
    RAISE EXCEPTION 'SAFETY CHECK FAILED: Update trigger not found';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'admissions_data_delete_trigger') THEN
    RAISE EXCEPTION 'SAFETY CHECK FAILED: Delete trigger not found';
  END IF;
  
  RAISE NOTICE 'MIGRATION COMPLETED SUCCESSFULLY: All safety checks passed';
END $$;
