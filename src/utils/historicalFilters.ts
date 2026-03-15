import { AdmissionRecord } from "@/types/dashboard";

export type HistoricalDetailedFilter = {
  school: string;
  program: string;
  status: string;
};

export const filterHistoricalByYear = (
  records: AdmissionRecord[],
  year: string
): AdmissionRecord[] => {
  if (year === "All") return records;
  return records.filter((r) => r["Attending Year"] === year);
};

export const filterHistoricalBySchool = (
  records: AdmissionRecord[],
  school: string
): AdmissionRecord[] => {
  if (school === "All") return records;
  return records.filter((r) => r.School.includes(school));
};

export const filterHistoricalByProgram = (
  records: AdmissionRecord[],
  program: string
): AdmissionRecord[] => {
  if (program === "All") return records;
  return records.filter((r) => r.Program.includes(program));
};

export const filterHistoricalByStatus = (
  records: AdmissionRecord[],
  status: string
): AdmissionRecord[] => {
  if (status === "All") return records;
  return records.filter((r) => r.Status === status);
};

export const applyHistoricalFilters = (
  records: AdmissionRecord[],
  year: string,
  filters: HistoricalDetailedFilter
): AdmissionRecord[] =>
  filterHistoricalByStatus(
    filterHistoricalByProgram(
      filterHistoricalBySchool(filterHistoricalByYear(records, year), filters.school),
      filters.program
    ),
    filters.status
  );
