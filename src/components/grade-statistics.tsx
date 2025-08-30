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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
      // When "All schools" is selected, show programs with at least 3 records
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

    // Show all programs that exist for this school (no threshold for school-specific)
    const filteredPrograms = Object.entries(programCounts)
      .map(([program, _]) => program)
      .sort();

    return ["All", ...filteredPrograms];
  }, [allRecords, filters.school, programs]);

  // Validate current program selection against available programs
  const validatedProgram = useMemo(() => {
    if (
      filters.program === "All" ||
      availablePrograms.includes(filters.program)
    ) {
      return filters.program;
    }
    return "All";
  }, [filters.program, availablePrograms]);

  // Dynamically filter schools based on selected program
  const availableSchools = useMemo(() => {
    if (filters.program === "All") {
      // When "All programs" is selected, show all schools
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

    // Show all schools that have this program (no threshold for program-specific)
    const filteredSchools = Object.entries(schoolCounts)
      .map(([school, _]) => school)
      .sort();

    return ["All", ...filteredSchools];
  }, [allRecords, filters.program, schools]);

  // Validate current school selection against available schools
  const validatedSchool = useMemo(() => {
    if (filters.school === "All" || availableSchools.includes(filters.school)) {
      return filters.school;
    }
    return "All";
  }, [filters.school, availableSchools]);

  // Handler functions for filter changes
  const handleSchoolChange = (value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, school: value };

      // If the current program is not available for the new school, reset it to "All"
      if (value !== "All") {
        const availableProgramsForSchool = allRecords
          .filter((record) => record.School.includes(value))
          .flatMap((record) => record.Program);

        if (
          !availableProgramsForSchool.includes(prev.program) &&
          prev.program !== "All"
        ) {
          newFilters.program = "All";
        }
      }

      return newFilters;
    });
  };

  const handleProgramChange = (value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, program: value };

      // If the current school is not available for the new program, reset it to "All"
      if (value !== "All") {
        const availableSchoolsForProgram = allRecords
          .filter((record) => record.Program.includes(value))
          .flatMap((record) => record.School);

        if (
          !availableSchoolsForProgram.includes(prev.school) &&
          prev.school !== "All"
        ) {
          newFilters.school = "All";
        }
      }

      return newFilters;
    });
  };

  const filteredData = useMemo(() => {
    const validatedFilters = {
      ...filters,
      school: validatedSchool,
      program: validatedProgram,
    };
    return allRecords.filter(createDataFilter(validatedFilters));
  }, [allRecords, filters, validatedSchool, validatedProgram]);

  const gradeStats = useMemo(() => {
    return calculateGradeStats(filteredData);
  }, [filteredData]);

  // Create grade distribution data for the chart
  const gradeDistribution = useMemo(() => {
    const validRecords = filteredData.filter(
      (record) => record.Average !== null
    );

    // Create individual grade ranges: 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100+
    const ranges = [
      {
        range: "85",
        min: 85,
        max: 85,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "86",
        min: 86,
        max: 86,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "87",
        min: 87,
        max: 87,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "88",
        min: 88,
        max: 88,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "89",
        min: 89,
        max: 89,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "90",
        min: 90,
        max: 90,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "91",
        min: 91,
        max: 91,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "92",
        min: 92,
        max: 92,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "93",
        min: 93,
        max: 93,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "94",
        min: 94,
        max: 94,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "95",
        min: 95,
        max: 95,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "96",
        min: 96,
        max: 96,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "97",
        min: 97,
        max: 97,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "98",
        min: 98,
        max: 98,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "99",
        min: 99,
        max: 99,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
      {
        range: "100+",
        min: 100,
        max: 999,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      },
    ];

    validRecords.forEach((record) => {
      const grade = record.Average!;
      const status = record.Status.toLowerCase();

      for (const range of ranges) {
        if (grade >= range.min && grade <= range.max) {
          if (status === "accepted") {
            range.accepted++;
          } else if (status === "waitlisted") {
            range.waitlisted++;
          } else if (status === "rejected") {
            range.rejected++;
          } else if (status === "deferred") {
            range.deferred++;
          }
          break;
        }
      }
    });

    return ranges.map((range) => ({
      range: range.range,
      accepted: range.accepted,
      waitlisted: range.waitlisted,
      rejected: range.rejected,
      deferred: range.deferred,
      total:
        range.accepted + range.waitlisted + range.rejected + range.deferred,
    }));
  }, [filteredData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "#10b981"; // green
      case "waitlisted":
        return "#f59e0b"; // amber
      case "rejected":
        return "#ef4444"; // red
      case "deferred":
        return "#8b5cf6"; // purple
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Grade Analysis
        </CardTitle>
        <CardDescription>
          Average and median grades with distribution by acceptance status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">School</label>
            <SearchableSelect
              value={validatedSchool}
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
              value={validatedProgram}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">
              {gradeStats.count}
            </div>
            <div className="text-sm text-purple-600">Total Records</div>
          </div>
        </div>

        {/* Grade Distribution Chart */}
        {gradeStats.count > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Grade Distribution by Status
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gradeDistribution}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name === "accepted"
                        ? "Accepted"
                        : name === "waitlisted"
                          ? "Waitlisted"
                          : name === "rejected"
                            ? "Rejected"
                            : name === "deferred"
                              ? "Deferred"
                              : name,
                    ]}
                  />
                  <Bar
                    dataKey="accepted"
                    stackId="a"
                    fill={getStatusColor("accepted")}
                    name="Accepted"
                  />
                  <Bar
                    dataKey="waitlisted"
                    stackId="a"
                    fill={getStatusColor("waitlisted")}
                    name="Waitlisted"
                  />
                  <Bar
                    dataKey="rejected"
                    stackId="a"
                    fill={getStatusColor("rejected")}
                    name="Rejected"
                  />
                  <Bar
                    dataKey="deferred"
                    stackId="a"
                    fill={getStatusColor("deferred")}
                    name="Deferred"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: getStatusColor("accepted") }}
                ></div>
                <span>Accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: getStatusColor("waitlisted") }}
                ></div>
                <span>Waitlisted</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: getStatusColor("rejected") }}
                ></div>
                <span>Rejected</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: getStatusColor("deferred") }}
                ></div>
                <span>Deferred</span>
              </div>
            </div>
          </div>
        )}

        {gradeStats.count === 0 && (
          <div className="text-center p-8 text-gray-500">
            No data available for these filters
          </div>
        )}
      </CardContent>
    </Card>
  );
}
