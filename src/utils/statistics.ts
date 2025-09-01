import { AdmissionRecord, RankingItem, GradeStats } from "@/types/dashboard";
import { getValidAverage } from "./validation";

export const calculateGradeStats = (records: AdmissionRecord[]): GradeStats => {
  const validGrades = records
    .map(getValidAverage)
    .filter((grade): grade is number => grade !== null);

  if (validGrades.length === 0) {
    return { average: 0, median: 0, count: 0 };
  }

  const sorted = [...validGrades].sort((a, b) => a - b);
  const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
  const median = getMedian(sorted);

  return {
    average: Math.round(average * 10) / 10,
    median: Math.round(median * 10) / 10,
    count: validGrades.length,
  };
};

const getMedian = (sortedGrades: number[]): number => {
  const length = sortedGrades.length;
  if (length % 2 === 0) {
    return (sortedGrades[length / 2 - 1] + sortedGrades[length / 2]) / 2;
  }
  return sortedGrades[Math.floor(length / 2)];
};

export const calculateCompetitiveRankings = (
  records: AdmissionRecord[],
  groupBy: 'school' | 'program'
): RankingItem[] => {
  const grouped: { [key: string]: number[] } = {};

  records.forEach((record) => {
    const keys = groupBy === 'school' ? record.School : record.Program;
    const grade = getValidAverage(record);
    
    if (grade !== null) {
      keys.forEach((key) => {
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(grade);
      });
    }
  });

  // Apply same minimum record requirements as dropdowns: 2+ for schools, 4+ for programs
  const minRecords = groupBy === 'program' ? 4 : 2;

  return Object.entries(grouped)
    .map(([name, grades]) => ({
      name,
      averageGrade: Math.round((grades.reduce((sum, grade) => sum + grade, 0) / grades.length) * 10) / 10,
      recordCount: grades.length,
      acceptanceRate: 0, // Not applicable for competitive rankings
    }))
    .filter(item => item.recordCount >= minRecords)
    .filter(item => {
      // Exclude specific programs like in dropdowns
      if (groupBy === 'program') {
        return item.name !== "Shopify Programs" && item.name !== "Toronto (St. George)";
      }
      return true;
    })
    .sort((a, b) => (b.averageGrade || 0) - (a.averageGrade || 0));
};

export const calculatePopularityRankings = (
  records: AdmissionRecord[],
  groupBy: 'school' | 'program'
): RankingItem[] => {
  const grouped: { [key: string]: { total: number; accepted: number } } = {};

  records.forEach((record) => {
    const keys = groupBy === 'school' ? record.School : record.Program;
    
    keys.forEach((key) => {
      if (!grouped[key]) {
        grouped[key] = { total: 0, accepted: 0 };
      }
      grouped[key].total++;
      if (record.Status === "Accepted") {
        grouped[key].accepted++;
      }
    });
  });

  // Apply same minimum record requirements as dropdowns: 2+ for schools, 4+ for programs
  const minRecords = groupBy === 'program' ? 4 : 2;

  return Object.entries(grouped)
    .map(([name, counts]) => ({
      name,
      recordCount: counts.total,
      applicationCount: counts.total,
      acceptanceRate: Math.round((counts.accepted / counts.total) * 100),
    }))
    .filter(item => item.recordCount >= minRecords)
    .filter(item => {
      // Exclude specific programs like in dropdowns
      if (groupBy === 'program') {
        return item.name !== "Shopify Programs" && item.name !== "Toronto (St. George)";
      }
      return true;
    })
    .sort((a, b) => (b.applicationCount || 0) - (a.applicationCount || 0));
}; 