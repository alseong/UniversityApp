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
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, school: value }))
              }
              placeholder="Select school"
              searchPlaceholder="Search schools..."
              options={schools.map((school) => ({
                value: school,
                label: school,
              }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Program</label>
            <SearchableSelect
              value={filters.program}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, program: value }))
              }
              placeholder="Select program"
              searchPlaceholder="Search programs..."
              options={programs.map((program) => ({
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
