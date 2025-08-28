import { AdmissionRecord } from "@/types/dashboard";

export const isValidRecord = (record: AdmissionRecord): boolean => {
  const average = parseFloat(record.Average);
  return (
    record.Average !== "" &&
    !isNaN(average) &&
    average >= 50 &&
    average <= 100
  );
};

export const getValidAverage = (record: AdmissionRecord): number | null => {
  if (!isValidRecord(record)) return null;
  return parseFloat(record.Average);
};

export const isAcceptedRecord = (record: AdmissionRecord): boolean => {
  return record.Status === "Accepted" && isValidRecord(record);
}; 