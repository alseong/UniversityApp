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

    // Count schools and programs to filter by minimum records
    const schoolCounts: { [key: string]: number } = {};
    const programCounts: { [key: string]: number } = {};
    
    allRecords.forEach((record) => {
      // Count schools
      record.School.forEach((school) => {
        schoolCounts[school] = (schoolCounts[school] || 0) + 1;
      });
      
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

    // Filter schools to only include those with at least 2 records
    const schoolsWithEnoughData = Object.entries(schoolCounts)
      .filter(([_, count]) => count >= 2)
      .sort(([, a], [, b]) => b - a) // Sort by count descending (greatest to least)
      .map(([school, count]) => school); // Keep original school names for filtering

    // Filter programs to only include those with at least 4 records
    const programsWithEnoughData = Object.entries(programCounts)
      .filter(([_, count]) => count >= 4)
      .filter(([program, _]) => program !== "Shopify Programs" && program !== "Toronto (St. George)") // Remove specific programs
      .sort(([, a], [, b]) => b - a) // Sort by count descending (greatest to least)
      .map(([program, count]) => program); // Keep original program names for filtering

    // Convert to sorted arrays with "All" option
    const schools = ["All", ...schoolsWithEnoughData];
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
      // Add the counts for display purposes
      schoolCounts,
      programCounts,
    };
  }, []);
}; 