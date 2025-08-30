"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { TrendingUp } from "lucide-react";
import { FilterState } from "@/types/dashboard";
import { useProcessedAdmissionData } from "@/utils/data";
import { createDataFilter } from "@/utils/filters";
import { calculateGradeStats } from "@/utils/statistics";

export default function GradeStatistics() {
  const [filters, setFilters] = useState<FilterState>({
    school: "All",
    program: "All",
    status: "All",
  });

  const { allRecords, schools, programs, statuses } =
    useProcessedAdmissionData();

  // Dynamically filter programs based on selected school
  const availablePrograms = useMemo(() => {
    if (filters.school === "All") {
      return programs;
    }

    // Find all programs that have records with the selected school
    const programCounts: { [key: string]: number } = {};

    allRecords.forEach((record) => {
      // Only consider records that include the selected school
      if (record.School.includes(filters.school)) {
        record.Program.forEach((program) => {
          programCounts[program] = (programCounts[program] || 0) + 1;
        });
      }
    });

    // Filter programs to only include those with at least 3 records for this school
    const filteredPrograms = Object.entries(programCounts)
      .filter(([_, count]) => count >= 3)
      .map(([program, _]) => program)
      .sort();

    return ["All", ...filteredPrograms];
  }, [allRecords, filters.school, programs]);

  // Dynamically filter schools based on selected program
  const availableSchools = useMemo(() => {
    if (filters.program === "All") {
      return schools;
    }

    // Find all schools that have records with the selected program
    const schoolCounts: { [key: string]: number } = {};

    allRecords.forEach((record) => {
      // Only consider records that include the selected program
      if (record.Program.includes(filters.program)) {
        record.School.forEach((school) => {
          schoolCounts[school] = (schoolCounts[school] || 0) + 1;
        });
      }
    });

    // Filter schools to only include those with at least 3 records for this program
    const filteredSchools = Object.entries(schoolCounts)
      .filter(([_, count]) => count >= 3)
      .map(([school, _]) => school)
      .sort();

    return ["All", ...filteredSchools];
  }, [allRecords, filters.program, schools]);

  // Handler functions for filter changes
  const handleSchoolChange = (value: string) => {
    setFilters((prev) => ({ ...prev, school: value }));
  };

  const handleProgramChange = (value: string) => {
    setFilters((prev) => ({ ...prev, program: value }));
  };

  const filteredData = useMemo(() => {
    return allRecords.filter(createDataFilter(filters));
  }, [allRecords, filters]);

  const gradeStats = useMemo(() => {
    return calculateGradeStats(filteredData);
  }, [filteredData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Grade Analysis
        </CardTitle>
        <CardDescription>
          Average and median grades based on filters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">School</label>
            <SearchableSelect
              value={filters.school}
              onValueChange={handleSchoolChange}
              placeholder="Select school"
              searchPlaceholder="Search schools..."
              options={availableSchools.map((school) => ({
                value: school,
                label: school,
              }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Program</label>
            <SearchableSelect
              value={filters.program}
              onValueChange={handleProgramChange}
              placeholder="Select program"
              searchPlaceholder="Search programs..."
              options={availablePrograms.map((program) => ({
                value: program,
                label: program,
              }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <SearchableSelect
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
              placeholder="Select status"
              searchPlaceholder="Search statuses..."
              options={statuses.map((status) => ({
                value: status,
                label: status,
              }))}
            />
          </div>
        </div>

        {/* Statistics Display */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {gradeStats.average}%
            </div>
            <div className="text-sm text-green-600">Average Grade</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {gradeStats.median}%
            </div>
            <div className="text-sm text-blue-600">Median Grade</div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 pt-2">
          Based on {gradeStats.count} records
        </div>
      </CardContent>
    </Card>
  );
}
