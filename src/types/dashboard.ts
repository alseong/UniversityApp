export interface AdmissionRecord {
  Status: string;
  Average: number | null;
  "Date Accepted": string;
  "Type (101/105)": string;
  Discord: string;
  Other: string;
  "Attending Year": string;
  School: string[];
  Program: string[];
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
  attendingYear: string;
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
  attendingYears: string[];
  schoolCounts: { [key: string]: number };
  programCounts: { [key: string]: number };
} 