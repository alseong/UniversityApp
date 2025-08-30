"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  BarChart3,
  Users,
  TrendingUp,
  Lock,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "../../supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProcessedAdmissionData } from "@/utils/data";
import {
  calculatePopularityRankings,
  calculateGradeStats,
} from "@/utils/statistics";
import { createDataFilter } from "@/utils/filters";

export default function HeroWithPreview() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { allRecords } = useProcessedAdmissionData();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  // Grade analysis with specific filters (Ryerson, Aerospace Engineering, All status)
  const gradeAnalysisData = useMemo(() => {
    const filters = {
      school: "Ryerson University",
      program: "Aerospace Engineering",
      status: "All",
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
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Single Source of Truth
              </span>{" "}
              for University Admissions
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Real admission statistics from students across Canada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!loading && (
                <>
                  <Link
                    href={user ? "/submit-data" : "/sign-in"}
                    className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                  >
                    Get Early Access
                    <ArrowUpRight className="ml-2 w-5 h-5" />
                  </Link>

                  <Link
                    href={user ? "/dashboard" : "/sign-in"}
                    className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
                  >
                    View Statistics
                  </Link>
                </>
              )}

              {loading && (
                <div className="flex gap-4">
                  <div className="px-8 py-4 bg-gray-200 rounded-lg animate-pulse">
                    <div className="w-32 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="px-8 py-4 bg-gray-100 rounded-lg animate-pulse">
                    <div className="w-28 h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>100% Anonymous</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Real Student Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Always Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="relative pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Some of What You'll Get Access To
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real insights from actual admission data. Here's a preview of some
              of the powerful analytics waiting for you.
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
                          <div className="font-medium text-sm">
                            {school.name}
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
                  +{" "}
                  {calculatePopularityRankings(allRecords, "school").length - 3}{" "}
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
                          <div className="text-xs text-gray-500">
                            {program.acceptanceRate}% acceptance rate
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
                  {calculatePopularityRankings(allRecords, "program").length -
                    3}{" "}
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
                  Access full rankings, detailed analytics, grade statistics,
                  and filtering capabilities
                </p>
                <Link href="/sign-up">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Sign Up for Full Access
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
