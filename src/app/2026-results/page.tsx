"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Users,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Award,
  Filter,
} from "lucide-react";

// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

interface UserData {
  universities: Array<{ name: string; program: string; status: string }>;
  grades: Array<any>;
  avg_grade_11?: string;
  avg_grade_12?: string;
}

export default function Insights2026() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSufficientData, setHasSufficientData] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      setUser(user);
      await loadUserData(user.id);
      setLoading(false);
    };
    checkUser();
  }, [router, supabase]);

  // Listen for auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/sign-in");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  // Set page title
  useEffect(() => {
    document.title = "2026 Live Insights - Real-time Admission Data | Admit.me";
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const { data: admissionData } = await supabase
        .from("admissions_data")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (admissionData) {
        setUserData(admissionData);

        // Check if user has sufficient data
        const hasUniversities =
          admissionData.universities &&
          admissionData.universities.length > 0 &&
          admissionData.universities.some(
            (u: any) => u.name && u.name.trim() !== ""
          );

        // Check for grades - either 6+ individual grades OR at least one average grade
        const hasIndividualGrades =
          admissionData.grades && admissionData.grades.length >= 6;
        const hasAverageGrades =
          (admissionData.avg_grade_11 &&
            admissionData.avg_grade_11.trim() !== "") ||
          (admissionData.avg_grade_12 &&
            admissionData.avg_grade_12.trim() !== "");

        const hasGrades = hasIndividualGrades || hasAverageGrades;

        setHasSufficientData(hasUniversities && hasGrades);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setHasSufficientData(false);
    }
  };

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  2026 Live Insights
                </h1>
                <p className="text-gray-600">
                  Real-time admission data and trends from students planning on
                  attending university in 2026 onwards
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {!hasSufficientData ? (
            /* CTA to add grade information */
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-amber-100 rounded-full w-fit">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl">
                  Complete Your Profile to View
                </CardTitle>
                <CardDescription className="text-lg">
                  - Universities your peers are interested in applying
                  <br />- Grades and achievements of your peers
                  <br />- Real time updates as acceptance results come out
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <div
                      className={`w-3 h-3 rounded-full ${userData?.universities && userData.universities.length > 0 && userData.universities.some((u: any) => u.name && u.name.trim() !== "") ? "bg-green-500" : "bg-gray-300"}`}
                      aria-label={
                        userData?.universities &&
                        userData.universities.length > 0 &&
                        userData.universities.some(
                          (u: any) => u.name && u.name.trim() !== ""
                        )
                          ? "University requirement met"
                          : "University requirement not met"
                      }
                    ></div>
                    <span>Add at least 1 Applied/Interested University</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <div
                      className={`w-3 h-3 rounded-full ${(userData?.grades && userData.grades.length >= 6) || (userData?.avg_grade_11 && userData.avg_grade_11.trim() !== "") || (userData?.avg_grade_12 && userData.avg_grade_12.trim() !== "") ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <span>
                      Add grades (6+ individual grades preferred, or at least 1
                      average grade)
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => router.push("/submit-data")}
                  className="px-8 py-3 text-lg"
                  size="lg"
                >
                  Complete Your Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Live 2026/2027 Insights */
            <div className="max-w-6xl mx-auto space-y-6">
              <AdmissionInsights />
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// Component to display admission insights
function AdmissionInsights() {
  const [insightsData, setInsightsData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const supabase = createClient();

  useEffect(() => {
    fetchInsightsData();
  }, []);

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch 2026/2027 data for authenticated users only
      const { data, error: fetchError } = await supabase
        .from("admissions_data")
        .select("*")
        .or(
          "university_attendance.ilike.%2026%,university_attendance.ilike.%2027%"
        )
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setInsightsData(data || []);
      setFilteredData(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch insights data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected university and program
  useEffect(() => {
    let filtered = insightsData;

    // First, filter out items where both universities/programs AND other achievements are empty
    filtered = filtered.filter((data) => {
      // Check if universities/programs have meaningful data
      const hasUniversities =
        data.universities &&
        data.universities.length > 0 &&
        data.universities.some(
          (uni: any) =>
            uni.name &&
            uni.name.trim() !== "" &&
            uni.program &&
            uni.program.trim() !== ""
        );

      // Check if other achievements have meaningful data
      const hasAchievements =
        data.other_achievements && data.other_achievements.trim() !== "";

      // Show item if it has either universities/programs OR achievements
      return hasUniversities || hasAchievements;
    });

    if (selectedUniversity !== "all") {
      filtered = filtered.filter((data) =>
        data.universities?.some((uni: any) => uni.name === selectedUniversity)
      );
    }

    if (selectedProgram !== "all") {
      filtered = filtered.filter((data) =>
        data.universities?.some((uni: any) => uni.program === selectedProgram)
      );
    }

    setFilteredData(filtered);
  }, [insightsData, selectedUniversity, selectedProgram]);

  // Get unique universities and programs from the data (only from items with meaningful content)
  const getUniqueUniversities = () => {
    const universities = new Set<string>();
    insightsData.forEach((data) => {
      // Only consider items that have meaningful content
      const hasUniversities =
        data.universities &&
        data.universities.length > 0 &&
        data.universities.some(
          (uni: any) =>
            uni.name &&
            uni.name.trim() !== "" &&
            uni.program &&
            uni.program.trim() !== ""
        );
      const hasAchievements =
        data.other_achievements && data.other_achievements.trim() !== "";

      if (hasUniversities || hasAchievements) {
        data.universities?.forEach((uni: any) => {
          if (uni.name && uni.name.trim() !== "") {
            universities.add(uni.name);
          }
        });
      }
    });
    return Array.from(universities).sort();
  };

  const getUniquePrograms = () => {
    const programs = new Set<string>();
    insightsData.forEach((data) => {
      // Only consider items that have meaningful content
      const hasUniversities =
        data.universities &&
        data.universities.length > 0 &&
        data.universities.some(
          (uni: any) =>
            uni.name &&
            uni.name.trim() !== "" &&
            uni.program &&
            uni.program.trim() !== ""
        );
      const hasAchievements =
        data.other_achievements && data.other_achievements.trim() !== "";

      if (hasUniversities || hasAchievements) {
        data.universities?.forEach((uni: any) => {
          if (uni.program && uni.program.trim() !== "") {
            programs.add(uni.program);
          }
        });
      }
    });
    return Array.from(programs).sort();
  };

  const calculateAverageGrade = (grades: any[], level: string) => {
    const levelGrades = grades.filter(
      (grade) =>
        grade.level === level && grade.grade !== null && grade.grade !== ""
    );
    if (levelGrades.length === 0) return null;

    const sum = levelGrades.reduce(
      (acc, grade) => acc + Number(grade.grade),
      0
    );
    return Math.round((sum / levelGrades.length) * 10) / 10; // Round to 1 decimal
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "default";
      case "waitlisted":
        return "secondary";
      case "rejected":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Error loading insights: {error}</p>
        <Button onClick={fetchInsightsData} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (insightsData.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          No 2026/2027 admission data available yet.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Be the first to share your admission data!
        </p>
      </div>
    );
  }

  const uniqueUniversities = getUniqueUniversities();
  const uniquePrograms = getUniquePrograms();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* University Filter */}
            {uniqueUniversities.length > 0 && (
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  University
                </label>
                <Select
                  value={selectedUniversity}
                  onValueChange={setSelectedUniversity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Universities" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="all">All Universities</SelectItem>
                    {uniqueUniversities.map((university) => (
                      <SelectItem key={university} value={university}>
                        {university}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Program Filter */}
            {uniquePrograms.length > 0 && (
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Program
                </label>
                <Select
                  value={selectedProgram}
                  onValueChange={setSelectedProgram}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="all">All Programs</SelectItem>
                    {uniquePrograms.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No students match the selected filters.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your filter criteria.
          </p>
        </div>
      ) : (
        filteredData.map((data, index) => {
          const avgGrade11 = data.avg_grade_11
            ? Number(data.avg_grade_11)
            : calculateAverageGrade(data.grades || [], "grade_11");
          const avgGrade12 = data.avg_grade_12
            ? Number(data.avg_grade_12)
            : calculateAverageGrade(data.grades || [], "grade_12");

          const grade11Courses = (data.grades || []).filter(
            (grade: any) =>
              grade.level === "grade_11" &&
              grade.grade !== null &&
              grade.grade !== ""
          );
          const grade12Courses = (data.grades || []).filter(
            (grade: any) =>
              grade.level === "grade_12" &&
              grade.grade !== null &&
              grade.grade !== ""
          );

          return (
            <Card key={data.id || index} className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">
                      {data.university_attendance || "University Student"}
                    </CardTitle>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    User: {data.user_id?.slice(-6) || "Unknown"}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Universities & Programs */}
                {data.universities && data.universities.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold text-sm">
                        Universities & Programs
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {data.universities.map((uni: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="font-medium text-sm">{uni.name}</p>
                            <p className="text-xs text-gray-600">
                              {uni.program}
                            </p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(uni.status)}>
                            {uni.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Average Grade 11 */}
                {avgGrade11 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <h4 className="font-semibold text-sm">
                        Average Grade 11: {avgGrade11}%
                      </h4>
                    </div>
                    {grade11Courses.length > 0 && (
                      <div className="space-y-1">
                        {grade11Courses.map((course: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between text-xs text-gray-600"
                          >
                            <span>
                              {course.courseName} ({course.courseCode})
                            </span>
                            <span>{course.grade}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Average Grade 12 */}
                {avgGrade12 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <h4 className="font-semibold text-sm">
                        Average Grade 12: {avgGrade12}%
                      </h4>
                    </div>
                    {grade12Courses.length > 0 && (
                      <div className="space-y-1">
                        {grade12Courses.map((course: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between text-xs text-gray-600"
                          >
                            <span>
                              {course.courseName} ({course.courseCode})
                            </span>
                            <span>{course.grade}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Other Achievements - Always show */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-semibold text-sm">
                      Other Achievements
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                    {data.other_achievements || "No achievements listed"}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
