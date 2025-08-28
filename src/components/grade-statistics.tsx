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
import processedData from "../../data/data_processed.json";

// Dynamically extract schools, programs, and statuses from the data
const getUniqueValues = () => {
  const data = processedData.data as AdmissionRecord[];

  const schoolCounts: { [key: string]: number } = {};
  const programCounts: { [key: string]: number } = {};
  const statusCounts: { [key: string]: number } = {};

  data.forEach((record) => {
    // Count schools
    record.school.forEach((school) => {
      schoolCounts[school] = (schoolCounts[school] || 0) + 1;
    });

    // Count programs
    if (record.Program) {
      programCounts[record.Program] = (programCounts[record.Program] || 0) + 1;
    }

    // Count statuses
    if (record.Status) {
      statusCounts[record.Status] = (statusCounts[record.Status] || 0) + 1;
    }
  });

  // Sort by count (descending) and return arrays
  const schools = Object.entries(schoolCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([school]) => school);

  const programs = Object.entries(programCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([program]) => program);

  const statuses = Object.entries(statusCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([status]) => status);

  return { schools, programs, statuses };
};

const {
  schools: SCHOOLS_WITH_DATA,
  programs: PROGRAMS_WITH_DATA,
  statuses: STATUSES_WITH_DATA,
} = getUniqueValues();

interface AdmissionRecord {
  Average: string;
  school: string[];
  Program: string;
  Status: string;
}

interface GradeStats {
  average: number;
  median: number;
  count: number;
}

export default function GradeStatistics() {
  const [selectedSchool, setSelectedSchool] = useState<string>("All");
  const [selectedProgram, setSelectedProgram] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const data = processedData.data as AdmissionRecord[];

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      // Filter by school
      if (selectedSchool !== "All" && !record.school.includes(selectedSchool)) {
        return false;
      }

      // Filter by program
      if (selectedProgram !== "All" && record.Program !== selectedProgram) {
        return false;
      }

      // Filter by status
      if (selectedStatus !== "All" && record.Status !== selectedStatus) {
        return false;
      }

      // Only include records with valid percentage averages (50-100)
      // This filters out GPA values (0-4.5) and obvious errors (>100 or <50)
      const average = parseFloat(record.Average);
      return (
        record.Average !== "" &&
        !isNaN(average) &&
        average >= 50 &&
        average <= 100
      );
    });
  }, [data, selectedSchool, selectedProgram, selectedStatus]);

  const gradeStats = useMemo((): GradeStats => {
    if (filteredData.length === 0) {
      return { average: 0, median: 0, count: 0 };
    }

    const averages = filteredData
      .map((record) => parseFloat(record.Average))
      .sort((a, b) => a - b);

    const sum = averages.reduce((acc, avg) => acc + avg, 0);
    const average = sum / averages.length;

    const median =
      averages.length % 2 === 0
        ? (averages[averages.length / 2 - 1] + averages[averages.length / 2]) /
          2
        : averages[Math.floor(averages.length / 2)];

    return {
      average: Math.round(average * 10) / 10,
      median: Math.round(median * 10) / 10,
      count: averages.length,
    };
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
              value={selectedSchool}
              onValueChange={setSelectedSchool}
              placeholder="Select school"
              searchPlaceholder="Search schools..."
              options={[
                { value: "All", label: "All Schools" },
                ...SCHOOLS_WITH_DATA.map((school: string) => ({
                  value: school,
                  label: school,
                })),
              ]}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Program</label>
            <SearchableSelect
              value={selectedProgram}
              onValueChange={setSelectedProgram}
              placeholder="Select program"
              searchPlaceholder="Search programs..."
              options={[
                { value: "All", label: "All Programs" },
                ...PROGRAMS_WITH_DATA.map((program: string) => ({
                  value: program,
                  label: program,
                })),
              ]}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <SearchableSelect
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              placeholder="Select status"
              searchPlaceholder="Search statuses..."
              options={[
                { value: "All", label: "All Statuses" },
                ...STATUSES_WITH_DATA.map((status: string) => ({
                  value: status,
                  label: status,
                })),
              ]}
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
