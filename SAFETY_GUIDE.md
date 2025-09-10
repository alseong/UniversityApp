# 🛡️ Master Table Migration Safety Guide

## ⚠️ CRITICAL SAFETY MEASURES

This migration includes multiple layers of safety guards to prevent accidental damage to your production database.

## 🔒 Safety Guards Implemented

### 1. **Production Database Protection**

- ❌ **BLOCKS** execution on databases with "prod" or "production" in the name
- ❌ **BLOCKS** execution if production-like tables are detected
- ✅ **LOGS** all migration attempts with database name

### 2. **Data Backup & Rollback**

- 📋 **BACKS UP** existing table structure before migration
- 📝 **LOGS** all rollback commands for emergency recovery
- 🔄 **PROVIDES** complete rollback script

### 3. **Data Integrity Verification**

- ✅ **VERIFIES** record counts match between original and master tables
- ✅ **CHECKS** all triggers are created successfully
- ⚠️ **WARNS** if data integrity issues are detected

### 4. **Migration Tracking**

- 📊 **TRACKS** migration status in `migration_rollback_log` table
- 🕐 **RECORDS** execution timestamps
- 📋 **STORES** rollback commands for each migration

## 🚀 Safe Migration Process

### Step 1: Pre-Migration Safety Check

```bash
# Run the safety check first
psql -d your_database -f scripts/pre-migration-safety-check.sql
```

### Step 2: Apply Migration

```bash
# Apply the migration (will fail safely if production detected)
supabase db push
```

### Step 3: Verify Success

```sql
-- Check migration status
SELECT * FROM migration_rollback_log
WHERE migration_name = '20241230000001_create_admissions_data_master';

-- Verify data integrity
SELECT COUNT(*) FROM admissions_data;
SELECT COUNT(*) FROM admissions_data_master;
```

## 🚨 Emergency Rollback

### If Something Goes Wrong:

```bash
# Set confirmation flag
export ROLLBACK_CONFIRMED=true

# Run rollback script
psql -d your_database -f supabase/migrations/ROLLBACK_20241230000001_create_admissions_data_master.sql
```

### Manual Rollback Commands:

```sql
-- Remove triggers
DROP TRIGGER IF EXISTS admissions_data_insert_trigger ON public.admissions_data;
DROP TRIGGER IF EXISTS admissions_data_update_trigger ON public.admissions_data;
DROP TRIGGER IF EXISTS admissions_data_delete_trigger ON public.admissions_data;

-- Remove functions
DROP FUNCTION IF EXISTS public.handle_admissions_data_insert();
DROP FUNCTION IF EXISTS public.handle_admissions_data_update();
DROP FUNCTION IF EXISTS public.handle_admissions_data_delete();
DROP FUNCTION IF EXISTS public.get_next_version_number(UUID);

-- Remove master table
DROP TABLE IF EXISTS public.admissions_data_master CASCADE;
```

## 🔍 What the Migration Does (Safe Operations)

### ✅ **SAFE - Only Adds New Things:**

- Creates new `admissions_data_master` table
- Creates new trigger functions
- Creates new indexes on new table
- Creates new RLS policies on new table
- **READS** existing data to copy it (no modifications)

### ❌ **NEVER Modifies:**

- Existing `admissions_data` table structure
- Existing data in `admissions_data`
- Existing triggers or functions
- Existing RLS policies
- Existing indexes

## 🛡️ Production Safety

### For Production Deployment:

1. **Test on staging first** - Always test the migration on a staging environment
2. **Backup database** - Create a full database backup before migration
3. **Run during maintenance window** - Schedule during low-traffic periods
4. **Monitor application** - Watch for any issues after migration
5. **Have rollback ready** - Keep rollback script ready for emergency use

### Production Override (NOT RECOMMENDED):

If you absolutely must run on production, you can override the safety check by modifying the migration file and removing the production check block.

## 📊 Monitoring After Migration

### Check These After Migration:

```sql
-- Verify triggers are working
INSERT INTO admissions_data (user_id, university_attendance)
VALUES ('test-user', 'Test University');

-- Check if master record was created
SELECT * FROM admissions_data_master WHERE user_id = 'test-user';

-- Clean up test data
DELETE FROM admissions_data WHERE user_id = 'test-user';
```

## 🆘 Emergency Contacts

If you encounter issues:

1. **Check migration logs** in `migration_rollback_log` table
2. **Run rollback script** if needed
3. **Restore from backup** if rollback fails
4. **Contact database administrator** for assistance

## ✅ Success Indicators

The migration was successful if:

- ✅ No error messages during migration
- ✅ `admissions_data_master` table exists
- ✅ All three triggers exist
- ✅ Record counts match between tables
- ✅ Application continues to work normally
- ✅ New inserts create master records

---

**Remember: This migration is designed to be safe, but always test in staging first!**
