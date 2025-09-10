import { createClient } from '@/supabase/client';
import { Tables } from '@/types/supabase';

type MasterRecord = Tables<'admissions_data_master'>;

/**
 * Utility functions for working with the admissions_data_master table
 */
export class MasterDataUtils {
  private supabase = createClient();

  /**
   * Get the complete version history for a user
   */
  async getUserVersionHistory(userId: string): Promise<MasterRecord[]> {
    const { data, error } = await this.supabase
      .from('admissions_data_master')
      .select('*')
      .eq('user_id', userId)
      .order('version_number', { ascending: true });

    if (error) {
      console.error('Error fetching user version history:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get the latest version of data for a user (even if deleted)
   */
  async getUserLatestVersion(userId: string): Promise<MasterRecord | null> {
    const { data, error } = await this.supabase
      .from('admissions_data_master')
      .select('*')
      .eq('user_id', userId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user latest version:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get all deleted records (for recovery purposes)
   */
  async getDeletedRecords(): Promise<MasterRecord[]> {
    const { data, error } = await this.supabase
      .from('admissions_data_master')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) {
      console.error('Error fetching deleted records:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Get records by operation type
   */
  async getRecordsByOperation(operationType: 'INSERT' | 'UPDATE' | 'DELETE'): Promise<MasterRecord[]> {
    const { data, error } = await this.supabase
      .from('admissions_data_master')
      .select('*')
      .eq('operation_type', operationType)
      .order('operation_timestamp', { ascending: false });

    if (error) {
      console.error(`Error fetching ${operationType} records:`, error);
      throw error;
    }

    return data || [];
  }

  /**
   * Restore a deleted record back to admissions_data
   */
  async restoreDeletedRecord(userId: string): Promise<boolean> {
    try {
      // Get the latest version for the user
      const latestVersion = await this.getUserLatestVersion(userId);
      
      if (!latestVersion || !latestVersion.deleted_at) {
        throw new Error('No deleted record found for this user');
      }

      // Insert the restored data back into admissions_data
      const { error } = await this.supabase
        .from('admissions_data')
        .insert({
          user_id: latestVersion.user_id,
          university_attendance: latestVersion.university_attendance,
          high_school: latestVersion.high_school,
          avg_grade_11: latestVersion.avg_grade_11,
          avg_grade_12: latestVersion.avg_grade_12,
          universities: latestVersion.universities,
          grades: latestVersion.grades,
        });

      if (error) {
        console.error('Error restoring record:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in restoreDeletedRecord:', error);
      return false;
    }
  }

  /**
   * Get statistics about the master table
   */
  async getMasterTableStats(): Promise<{
    totalRecords: number;
    insertCount: number;
    updateCount: number;
    deleteCount: number;
    uniqueUsers: number;
  }> {
    const { data, error } = await this.supabase
      .from('admissions_data_master')
      .select('operation_type, user_id');

    if (error) {
      console.error('Error fetching master table stats:', error);
      throw error;
    }

    const records = data || [];
    const uniqueUsers = new Set(records.map(r => r.user_id)).size;
    
    return {
      totalRecords: records.length,
      insertCount: records.filter(r => r.operation_type === 'INSERT').length,
      updateCount: records.filter(r => r.operation_type === 'UPDATE').length,
      deleteCount: records.filter(r => r.operation_type === 'DELETE').length,
      uniqueUsers,
    };
  }

  /**
   * Compare two versions of a user's data
   */
  compareVersions(version1: MasterRecord, version2: MasterRecord): {
    changedFields: string[];
    changes: Record<string, { from: any; to: any }>;
  } {
    const changedFields: string[] = [];
    const changes: Record<string, { from: any; to: any }> = {};

    const fieldsToCompare = [
      'university_attendance',
      'high_school',
      'avg_grade_11',
      'avg_grade_12',
      'universities',
      'grades'
    ];

    fieldsToCompare.forEach(field => {
      const val1 = version1[field as keyof MasterRecord];
      const val2 = version2[field as keyof MasterRecord];
      
      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        changedFields.push(field);
        changes[field] = { from: val1, to: val2 };
      }
    });

    return { changedFields, changes };
  }
}

// Export a singleton instance
export const masterDataUtils = new MasterDataUtils();
