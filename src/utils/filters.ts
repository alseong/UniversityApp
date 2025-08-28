import { AdmissionRecord, FilterState } from "@/types/dashboard";

export const createDataFilter = (filters: FilterState) => {
  return (record: AdmissionRecord): boolean => {
    // Filter by school
    if (
      filters.school &&
      filters.school !== "All" &&
      !record.school.includes(filters.school)
    ) {
      return false;
    }

    // Filter by program
    if (
      filters.program &&
      filters.program !== "All" &&
      !record.program.includes(filters.program)
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
    const average = parseFloat(record.Average);
    return (
      record.Average !== "" &&
      !isNaN(average) &&
      average >= 50 &&
      average <= 100
    );
  });
};

export const filterAcceptedRecords = (records: AdmissionRecord[]): AdmissionRecord[] => {
  return filterValidRecords(records).filter(record => record.Status === "Accepted");
}; 