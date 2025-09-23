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
import GradeStatistics from "@/components/grade-statistics";
import CompetitivePrograms from "@/components/competitive-programs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Custom GradeStatistics component for landing page preview
const GradeStatisticsPreview = ({ user }: { user: any }) => {
  const { allRecords, schools, programs, attendingYears } =
    useProcessedAdmissionData();

  // Pre-selected filters for University of Waterloo and Computer Science
  const filters = {
    school: "University of Waterloo",
    program: "Computer Science",
    status: "All",
    attendingYear: "All",
  };

  // Filter the data based on the pre-selected filters
  const filteredData = useMemo(() => {
    return allRecords.filter(createDataFilter(filters));
  }, [allRecords, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    return calculateGradeStats(filteredData);
  }, [filteredData]);

  // Create grade distribution data for the chart
  const gradeDistribution = useMemo(() => {
    const validRecords = filteredData.filter(
      (record) => record.Average !== null
    );

    if (validRecords.length === 0) {
      return [];
    }

    // Get all unique grades from the filtered data
    const grades = validRecords
      .map((record) => record.Average!)
      .sort((a, b) => a - b);
    const minGrade = Math.floor(grades[0] / 5) * 5; // Round down to nearest 5
    const maxGrade = Math.ceil(grades[grades.length - 1] / 5) * 5; // Round up to nearest 5

    // Create dynamic grade ranges based on the actual data
    const ranges: Array<{
      range: string;
      min: number;
      max: number;
      accepted: number;
      waitlisted: number;
      rejected: number;
      deferred: number;
    }> = [];

    // Create ranges for each grade that exists in the data
    for (let grade = minGrade; grade <= maxGrade; grade++) {
      ranges.push({
        range: grade >= 100 ? "100+" : grade.toString(),
        min: grade >= 100 ? 100 : grade,
        max: grade >= 100 ? 999 : grade,
        accepted: 0,
        waitlisted: 0,
        rejected: 0,
        deferred: 0,
      });
    }

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

    // Only return ranges that have data
    return ranges
      .filter(
        (range) =>
          range.accepted + range.waitlisted + range.rejected + range.deferred >
          0
      )
      .map((range) => ({
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
        return "#10b981";
      case "waitlisted":
        return "#f59e0b";
      case "rejected":
        return "#ef4444";
      case "deferred":
        return "#8b5cf6";
      default:
        return "#6b7280";
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
          Average and median grades with distribution graph
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm">
            <span className="font-medium text-gray-700">School:</span>
            <div className="text-gray-600">{filters.school}</div>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Program:</span>
            <div className="text-gray-600">{filters.program}</div>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Status:</span>
            <div className="text-gray-600">{filters.status}</div>
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">Year:</span>
            <div className="text-gray-600">{filters.attendingYear}</div>
          </div>
        </div>

        {/* Statistics Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
              -- <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-sm text-gray-600">Average Grade</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
              -- <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-sm text-gray-600">Median Grade</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-2">
              -- <Lock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-sm text-gray-600">Total Records</div>
          </div>
        </div>

        {/* Grade Distribution Chart */}
        {gradeDistribution.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">
              Grade Distribution
            </h4>
            {/* Chart with overlay */}
            <div className="h-64 relative">
              {/* Blurred chart background */}
              <div className="absolute inset-0 blur-sm bg-white bg-opacity-50 z-10"></div>

              {/* Lock overlay content - positioned directly over the chart */}
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="text-center bg-white rounded-lg p-6 shadow-lg">
                  <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-700 text-center font-medium mb-1">
                    Sign up to see complete data
                  </p>
                  <p className="text-gray-500 text-center text-sm mb-4">
                    Access full rankings, detailed analytics, grade statistics,
                    and filtering capabilities
                  </p>
                  <Link href={user ? "/dashboard" : "/sign-up"}>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      {user ? "Go to Dashboard" : "Sign Up for Full Access"}
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={() => "-"}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="accepted"
                    stackId="a"
                    fill={getStatusColor("accepted")}
                  />
                  <Bar
                    dataKey="waitlisted"
                    stackId="a"
                    fill={getStatusColor("waitlisted")}
                  />
                  <Bar
                    dataKey="rejected"
                    stackId="a"
                    fill={getStatusColor("rejected")}
                  />
                  <Bar
                    dataKey="deferred"
                    stackId="a"
                    fill={getStatusColor("deferred")}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center text-xs">
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
      </CardContent>
    </Card>
  );
};

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
                    Sign Up
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

          {/* Grade Analysis Preview - Full Width */}
          <div className="mb-6">
            <GradeStatisticsPreview user={user} />
          </div>

          {/* And More Message */}
          <div className="text-center py-8">
            <p className="text-2xl font-bold text-gray-700 mb-2">
              ... and more!
            </p>
            <p className="text-gray-600">
              Sign up to access complete rankings, detailed analytics, grade
              statistics, and advanced filtering capabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
