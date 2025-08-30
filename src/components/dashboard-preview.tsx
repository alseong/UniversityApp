"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, TrendingUp, Lock, ArrowRight } from "lucide-react";
import { useProcessedAdmissionData } from "@/utils/data";
import {
  calculatePopularityRankings,
  calculateGradeStats,
} from "@/utils/statistics";
import { createDataFilter } from "@/utils/filters";
import Link from "next/link";

export default function DashboardPreview() {
  const { allRecords } = useProcessedAdmissionData();

  // Grade analysis with specific filters (Ryerson, Aerospace Engineering, All status)
  const gradeAnalysisData = useMemo(() => {
    const filters = {
      school: "Ryerson University",
      program: "Aerospace Engineering",
      status: "All",
      attendingYear: "All",
    };

    const filteredRecords = allRecords.filter(createDataFilter(filters));
    const stats = calculateGradeStats(filteredRecords);

    return {
      stats,
      recordCount: filteredRecords.length,
      filters,
    };
  }, [allRecords]);

  const popularSchools = useMemo(() => {
    return calculatePopularityRankings(allRecords, "school").slice(0, 3);
  }, [allRecords]);

  const popularPrograms = useMemo(() => {
    return calculatePopularityRankings(allRecords, "program").slice(0, 3);
  }, [allRecords]);

  const getCountColor = (count: number): string => {
    if (count >= 500) return "text-red-600 bg-red-50";
    if (count >= 200) return "text-orange-600 bg-orange-50";
    if (count >= 100) return "text-yellow-600 bg-yellow-50";
    if (count >= 50) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            See What You'll Get Access To
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real insights from actual admission data. Here's a preview of the
            powerful analytics waiting for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Grade Analysis Preview */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Grade Analysis
              </CardTitle>
              <CardDescription>
                Average and median grades based on filters
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filter Display */}
              <div className="space-y-2 mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">School:</span>{" "}
                  {gradeAnalysisData.filters.school}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Program:</span>{" "}
                  {gradeAnalysisData.filters.program}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  {gradeAnalysisData.filters.status}
                </div>
              </div>

              {/* Statistics Display */}
              {gradeAnalysisData.stats.count > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {gradeAnalysisData.stats.average}%
                    </div>
                    <div className="text-sm text-gray-600">Average Grade</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {gradeAnalysisData.stats.median}%
                    </div>
                    <div className="text-sm text-gray-600">Median Grade</div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  No data available for these filters
                </div>
              )}

              <div className="mt-4 text-center text-sm text-gray-500">
                Based on {gradeAnalysisData.recordCount} records
              </div>
            </CardContent>
          </Card>

          {/* Most Popular Schools Preview */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Most Popular Schools
              </CardTitle>
              <CardDescription>
                Top schools by application volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularSchools.map((school, index) => (
                  <div
                    key={school.name}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{school.name}</div>
                        <div className="text-xs text-gray-500">
                          {school.acceptanceRate}% acceptance rate
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-2 py-1 rounded text-sm font-semibold ${getCountColor(school.applicationCount || 0)}`}
                      >
                        {school.applicationCount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                + {calculatePopularityRankings(allRecords, "school").length - 3}{" "}
                more schools available
              </div>
            </CardContent>
          </Card>

          {/* Most Popular Programs Preview */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Most Popular Programs
              </CardTitle>
              <CardDescription>
                Top programs by application volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularPrograms.map((program, index) => (
                  <div
                    key={program.name}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {program.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-2 py-1 rounded text-sm font-semibold ${getCountColor(program.applicationCount || 0)}`}
                      >
                        {program.applicationCount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                +{" "}
                {calculatePopularityRankings(allRecords, "program").length - 3}{" "}
                more programs available
              </div>
            </CardContent>
          </Card>

          {/* Overlay for the preview effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none" />

          {/* Call to Action */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t p-6 rounded-b-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Sign up to see complete data
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Access full rankings, detailed analytics, grade statistics, and
                filtering capabilities
              </p>
              <Link href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Sign Up for Full Access
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
