export interface AdmissionRecord {
  Status: string;
  Average: number | null;
  "Date Accepted": string;
  "Type (101/105)": string;
  Discord: string;
  Other: string;
  "Message ID": string;
  Tags: string;
  "Attending Year": string;
  school: string[];
  school_original: string;
  record_id: number;
  program: string[];
  program_original: string;
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