export interface AdmissionRecord {
  Average: string;
  school: string[];
  program: string[];
  Status: string;
}

export interface RankingItem {
  name: string;
  averageGrade?: number;
  recordCount: number;
  applicationCount?: number;
  acceptanceRate: number;
}

export interface FilterState {
  school: string;
  program: string;
  status: string;
}

export interface GradeStats {
  average: number;
  median: number;
  count: number;
}

export interface ProcessedData {
  allRecords: AdmissionRecord[];
  acceptedRecords: AdmissionRecord[];
  schools: string[];
  programs: string[];
  statuses: string[];
} 