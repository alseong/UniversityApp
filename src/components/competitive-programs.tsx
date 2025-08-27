"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import finalData from "../../data/data_final.json";

interface AdmissionRecord {
  Average: number | null;
  Schools: string[];
  Programs: string[];
  Status: string;
}

interface ProgramStats {
  name: string;
  averageGrade: number;
  recordCount: number;
}

export default function CompetitivePrograms() {
  const programStats = useMemo((): ProgramStats[] => {
    const data = finalData.data as AdmissionRecord[];

    // Filter for accepted students with valid percentage grades (50-100)
    const acceptedRecords = data.filter(
      (record) =>
        record.Status === "Accepted" &&
        record.Average !== null &&
        typeof record.Average === "number" &&
        record.Average >= 50 &&
        record.Average <= 100
    );

    // Group by program and calculate averages
    const programData: { [key: string]: number[] } = {};

    acceptedRecords.forEach((record) => {
      record.Programs.forEach((program) => {
        if (!programData[program]) {
          programData[program] = [];
        }
        programData[program].push(record.Average!);
      });
    });

    // Calculate average for each program and sort by competitiveness
    const stats = Object.entries(programData)
      .map(([name, grades]) => ({
        name,
        averageGrade:
          Math.round(
            (grades.reduce((sum, grade) => sum + grade, 0) / grades.length) * 10
          ) / 10,
        recordCount: grades.length,
      }))
      .filter((stat) => stat.recordCount >= 10) // Only include programs with 10+ records
      .sort((a, b) => b.averageGrade - a.averageGrade); // Sort by highest average (most competitive)

    return stats;
  }, []);

  const getCompetitivenessLabel = (averageGrade: number): string => {
    if (averageGrade >= 96) return "Extremely Competitive";
    if (averageGrade >= 94) return "Highly Competitive";
    if (averageGrade >= 92) return "Very Competitive";
    if (averageGrade >= 90) return "Competitive";
    return "Moderate";
  };

  const getGradeColor = (averageGrade: number): string => {
    if (averageGrade >= 96) return "text-red-600 bg-red-50";
    if (averageGrade >= 94) return "text-orange-600 bg-orange-50";
    if (averageGrade >= 92) return "text-yellow-600 bg-yellow-50";
    if (averageGrade >= 90) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Most Competitive Programs
        </CardTitle>
        <CardDescription>
          Ranked by average grade of accepted students
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <div className="relative">
          <div className="h-64 overflow-y-auto space-y-3 mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {programStats.map((program, index) => (
              <div
                key={program.name}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{program.name}</div>
                    <div className="text-xs text-gray-500">
                      {program.recordCount} accepted students
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-2 py-1 rounded text-sm font-semibold ${getGradeColor(program.averageGrade)}`}
                  >
                    {program.averageGrade}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getCompetitivenessLabel(program.averageGrade)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Scroll indicator gradient */}
          <div className="absolute bottom-4 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
          {/* Scroll hint */}
          <div className="absolute bottom-1 right-2 text-xs text-gray-400 flex items-center gap-1">
            <span>Scroll for more</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        <div className="pt-4 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            Higher average = more competitive admission
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
