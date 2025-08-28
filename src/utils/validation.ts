import { AdmissionRecord } from "@/types/dashboard";

export const isValidRecord = (record: AdmissionRecord): boolean => {
  return (
    record.Average !== null &&
    typeof record.Average === 'number' &&
    !isNaN(record.Average) &&
    record.Average >= 50 &&
    record.Average <= 100
  );
};

export const getValidAverage = (record: AdmissionRecord): number | null => {
  if (!isValidRecord(record)) return null;
  return record.Average;
};

export const isAcceptedRecord = (record: AdmissionRecord): boolean => {
  return record.Status === "Accepted" && isValidRecord(record);
}; 