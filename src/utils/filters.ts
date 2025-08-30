import { AdmissionRecord, FilterState } from "@/types/dashboard";

export const createDataFilter = (filters: FilterState) => {
  return (record: AdmissionRecord): boolean => {
    // Filter by school
    if (
      filters.school &&
      filters.school !== "All" &&
      !record.School.includes(filters.school)
    ) {
      return false;
    }

    // Filter by program
    if (
      filters.program &&
      filters.program !== "All" &&
      !record.Program.includes(filters.program)
    ) {
      return false;
    }

    // Filter by status
    if (
      filters.status &&
      filters.status !== "All" &&
      record.Status !== filters.status
    ) {
      return false;
    }

    return true;
  };
};

export const filterValidRecords = (records: AdmissionRecord[]): AdmissionRecord[] => {
  return records.filter(record => {
    return (
      record.Average !== null &&
      typeof record.Average === 'number' &&
      !isNaN(record.Average) &&
      record.Average >= 50 &&
      record.Average <= 100
    );
  });
};

export const filterAcceptedRecords = (records: AdmissionRecord[]): AdmissionRecord[] => {
  return filterValidRecords(records).filter(record => record.Status === "Accepted");
}; 