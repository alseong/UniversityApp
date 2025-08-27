"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import finalData from "../../data/data_final.json";

// Schools that actually have data (based on process_schools.js output)
const SCHOOLS_WITH_DATA = [
  "University of Waterloo", // 669 records
  "McMaster University", // 348 records
  "University of Toronto St. George", // 290 records
  "Western University", // 247 records
  "Queen's University", // 190 records
  "Toronto Metropolitan University", // 174 records
  "Wilfrid Laurier University", // 140 records
  "York University", // 126 records
  "University of Ottawa", // 97 records
  "Carleton University", // 94 records
  "University of Toronto Scarborough", // 61 records
  "University of Guelph", // 61 records
  "McGill University", // 46 records
  "University of Toronto Mississauga", // 46 records
  "Brock University", // 20 records
];

// Programs that actually have data (based on process_schools.js output)
const PROGRAMS_WITH_DATA = [
  "Computer Science", // 599 records
  "Business Administration", // 160 records
  "Engineering", // 139 records
  "Computer Engineering", // 114 records
  "Commerce", // 89 records
  "Life Sciences", // 83 records
  "Mathematics", // 80 records
  "Health Sciences", // 70 records
  "Software Engineering", // 66 records
  "Mechanical Engineering", // 41 records
  "Electrical Engineering", // 38 records
  "Engineering Science", // 36 records
  "Science", // 34 records
  "Biomedical Engineering", // 26 records
  "Medical Sciences", // 22 records
];

// Statuses that actually have data (based on process_schools.js output)
const STATUSES_WITH_DATA = [
  "Accepted", // 2528 records
  "Rejected", // 232 records
  "Deferred", // 172 records
  "Waitlisted", // 44 records
];

interface AdmissionRecord {
  Average: number | null;
  Schools: string[];
  Programs: string[];
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

  const data = finalData.data as AdmissionRecord[];

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      // Filter by school
      if (
        selectedSchool !== "All" &&
        !record.Schools.includes(selectedSchool)
      ) {
        return false;
      }

      // Filter by program
      if (
        selectedProgram !== "All" &&
        !record.Programs.includes(selectedProgram)
      ) {
        return false;
      }

      // Filter by status
      if (selectedStatus !== "All" && record.Status !== selectedStatus) {
        return false;
      }

      // Only include records with valid percentage averages (50-100)
      // This filters out GPA values (0-4.5) and obvious errors (>100 or <50)
      return (
        record.Average !== null &&
        typeof record.Average === "number" &&
        record.Average >= 50 &&
        record.Average <= 100
      );
    });
  }, [data, selectedSchool, selectedProgram, selectedStatus]);

  const gradeStats = useMemo((): GradeStats => {
    if (filteredData.length === 0) {
      return { average: 0, median: 0, count: 0 };
    }

    const averages = filteredData
      .map((record) => record.Average!)
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
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="h-10 px-3 py-2">
                <SelectValue placeholder="Select school" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Schools</SelectItem>
                {SCHOOLS_WITH_DATA.map((school: string) => (
                  <SelectItem key={school} value={school}>
                    {school}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Program</label>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="h-10 px-3 py-2">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Programs</SelectItem>
                {PROGRAMS_WITH_DATA.map((program: string) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-10 px-3 py-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {STATUSES_WITH_DATA.map((status: string) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
