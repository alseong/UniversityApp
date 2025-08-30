import { useMemo } from "react";
import { AdmissionRecord, ProcessedData } from "@/types/dashboard";
import { filterValidRecords, filterAcceptedRecords } from "./filters";
import processedData from "../../data/data_fully_processed.json";

export const useProcessedAdmissionData = (): ProcessedData => {
  return useMemo(() => {
    const rawData = processedData.data as AdmissionRecord[];
    const allRecords = filterValidRecords(rawData);
    const acceptedRecords = filterAcceptedRecords(rawData);

    // Extract unique values
    const schoolsSet = new Set<string>();
    const programsSet = new Set<string>();
    const statusesSet = new Set<string>();
    const attendingYearsSet = new Set<string>();

    // Count programs to filter by minimum records
    const programCounts: { [key: string]: number } = {};
    
    allRecords.forEach((record) => {
      // Add schools
      record.School.forEach((school) => schoolsSet.add(school));
      
      // Count programs
      record.Program.forEach((program) => {
        programCounts[program] = (programCounts[program] || 0) + 1;
      });
      
      // Add status
      if (record.Status) {
        statusesSet.add(record.Status);
      }

      // Add attending year
      if (record["Attending Year"]) {
        attendingYearsSet.add(record["Attending Year"]);
      }
    });

    // Filter programs to only include those with at least 3 records
    const programsWithEnoughData = Object.entries(programCounts)
      .filter(([_, count]) => count >= 3)
      .map(([program, _]) => program)
      .sort();

    // Convert to sorted arrays with "All" option
    const schools = ["All", ...Array.from(schoolsSet).sort()];
    const programs = ["All", ...programsWithEnoughData];
    const statuses = ["All", ...Array.from(statusesSet).sort()];
    const attendingYears = ["All", ...Array.from(attendingYearsSet).sort()];

    return {
      allRecords,
      acceptedRecords,
      schools,
      programs,
      statuses,
      attendingYears,
    };
  }, []);
}; 