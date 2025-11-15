"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  BarChart3,
  Users,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Award,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AdmissionRecord, ProcessedData } from "@/types/dashboard";
import { filterValidRecords, filterAcceptedRecords } from "@/utils/filters";
import { calculateGradeStats } from "@/utils/statistics";

// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

// Context for 2026 processed data
const Processed2026DataContext = createContext<ProcessedData | null>(null);

// Hook to use 2026 processed data
const use2026ProcessedData = (): ProcessedData | null => {
  return useContext(Processed2026DataContext);
};

// Provider component for 2026 data
function Processed2026DataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabaseData, setSupabaseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("admissions_data")
          .select("*")
          .or(
            "university_attendance.ilike.%2026%,university_attendance.ilike.%2027%"
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching 2026 data:", error);
          setSupabaseData([]);
        } else {
          setSupabaseData(data || []);
        }
      } catch (err) {
        console.error("Error fetching 2026 data:", err);
        setSupabaseData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const processedData = useMemo(() => {
    if (loading || supabaseData.length === 0) {
      return {
        allRecords: [],
        acceptedRecords: [],
        schools: ["All"],
        programs: ["All"],
        statuses: ["All"],
        attendingYears: ["All"],
        schoolCounts: {},
        programCounts: {},
      };
    }

    const records = transformSupabaseDataToAdmissionRecords(supabaseData);
    return process2026Data(records);
  }, [supabaseData, loading]);

  return (
    <Processed2026DataContext.Provider value={processedData}>
      {children}
    </Processed2026DataContext.Provider>
  );
}

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
            <Processed2026DataProvider>
              <div className="max-w-6xl mx-auto space-y-6">
                <AdmissionInsightsWithFilters />
              </div>
            </Processed2026DataProvider>
          )}
        </div>
      </main>
    </>
  );
}

// Transform Supabase data to AdmissionRecord format
const transformSupabaseDataToAdmissionRecords = (
  supabaseData: any[]
): AdmissionRecord[] => {
  const records: AdmissionRecord[] = [];

  supabaseData.forEach((data) => {
    if (!data.universities || data.universities.length === 0) {
      return;
    }

    // Calculate average grade
    let average: number | null = null;
    if (data.avg_grade_12) {
      average = Number(data.avg_grade_12);
    } else if (data.avg_grade_11) {
      average = Number(data.avg_grade_11);
    } else if (data.grades && data.grades.length > 0) {
      // Calculate from individual grades
      const grade12Grades = data.grades.filter(
        (g: any) => g.level === "grade_12" && g.grade !== null && g.grade !== ""
      );
      if (grade12Grades.length > 0) {
        const sum = grade12Grades.reduce(
          (acc: number, g: any) => acc + Number(g.grade),
          0
        );
        average = sum / grade12Grades.length;
      } else {
        const grade11Grades = data.grades.filter(
          (g: any) =>
            g.level === "grade_11" && g.grade !== null && g.grade !== ""
        );
        if (grade11Grades.length > 0) {
          const sum = grade11Grades.reduce(
            (acc: number, g: any) => acc + Number(g.grade),
            0
          );
          average = sum / grade11Grades.length;
        }
      }
    }

    // Create a record for each university/program combination
    data.universities.forEach((uni: any) => {
      if (
        uni.name &&
        uni.name.trim() !== "" &&
        uni.program &&
        uni.program.trim() !== ""
      ) {
        records.push({
          School: [uni.name],
          Program: [uni.program],
          Status: uni.status || "pending",
          Average: average,
          "Date Accepted": "",
          "Type (101/105)": "",
          Discord: "",
          Other: "",
          "Attending Year": data.university_attendance || "",
        });
      }
    });
  });

  return records;
};

// Process 2026/2027 data similar to useProcessedAdmissionData
const process2026Data = (records: AdmissionRecord[]): ProcessedData => {
  const allRecords = filterValidRecords(records);
  const acceptedRecords = filterAcceptedRecords(records);

  // Extract unique values
  const schoolsSet = new Set<string>();
  const programsSet = new Set<string>();
  const statusesSet = new Set<string>();
  const attendingYearsSet = new Set<string>();

  // Count schools and programs
  const schoolCounts: { [key: string]: number } = {};
  const programCounts: { [key: string]: number } = {};

  allRecords.forEach((record) => {
    record.School.forEach((school) => {
      schoolsSet.add(school);
      schoolCounts[school] = (schoolCounts[school] || 0) + 1;
    });

    record.Program.forEach((program) => {
      programsSet.add(program);
      programCounts[program] = (programCounts[program] || 0) + 1;
    });

    if (record.Status) {
      statusesSet.add(record.Status);
    }

    if (record["Attending Year"]) {
      attendingYearsSet.add(record["Attending Year"]);
    }
  });

  // Filter schools to only include those with at least 2 records
  const schoolsWithEnoughData = Object.entries(schoolCounts)
    .filter(([_, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .map(([school]) => school);

  // Filter programs to only include those with at least 4 records
  const programsWithEnoughData = Object.entries(programCounts)
    .filter(([_, count]) => count >= 4)
    .sort(([, a], [, b]) => b - a)
    .map(([program]) => program);

  return {
    allRecords,
    acceptedRecords,
    schools: ["All", ...schoolsWithEnoughData],
    programs: ["All", ...programsWithEnoughData],
    statuses: ["All", ...Array.from(statusesSet).sort()],
    attendingYears: ["All", ...Array.from(attendingYearsSet).sort()],
    schoolCounts,
    programCounts,
  };
};

// Component that combines filters, grade analysis, and results
function AdmissionInsightsWithFilters() {
  const [insightsData, setInsightsData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedExtracurriculars, setSelectedExtracurriculars] =
    useState<string>("all");
  const supabase = createClient();

  useEffect(() => {
    fetchInsightsData();
  }, []);

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      setError(null);

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

  // Filter data based on selected filters
  useEffect(() => {
    let filtered = insightsData;

    // First, filter out items where both universities/programs AND other achievements are empty
    filtered = filtered.filter((data) => {
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

    if (selectedStatus !== "all") {
      filtered = filtered.filter((data) =>
        data.universities?.some((uni: any) => uni.status === selectedStatus)
      );
    }

    if (selectedExtracurriculars !== "all") {
      const hasExtracurriculars = (data: any) => {
        return data.other_achievements && data.other_achievements.trim() !== "";
      };

      if (selectedExtracurriculars === "has") {
        filtered = filtered.filter(hasExtracurriculars);
      } else if (selectedExtracurriculars === "none") {
        filtered = filtered.filter((data) => !hasExtracurriculars(data));
      }
    }

    setFilteredData(filtered);
  }, [
    insightsData,
    selectedUniversity,
    selectedProgram,
    selectedStatus,
    selectedExtracurriculars,
  ]);

  // Dynamically filter universities based on selected program
  const availableUniversities = useMemo(() => {
    const universities = new Set<string>();

    if (selectedProgram === "all") {
      // When "All programs" is selected, show all universities
      insightsData.forEach((data) => {
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
    } else {
      // When a specific program is selected, only show universities that have that program
      insightsData.forEach((data) => {
        if (data.universities && data.universities.length > 0) {
          data.universities.forEach((uni: any) => {
            if (
              uni.program === selectedProgram &&
              uni.name &&
              uni.name.trim() !== ""
            ) {
              universities.add(uni.name);
            }
          });
        }
      });
    }

    return Array.from(universities).sort();
  }, [insightsData, selectedProgram]);

  // Dynamically filter programs based on selected university
  const availablePrograms = useMemo(() => {
    const programs = new Set<string>();

    if (selectedUniversity === "all") {
      // When "All universities" is selected, show all programs
      insightsData.forEach((data) => {
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
    } else {
      // When a specific university is selected, only show programs that have that university
      insightsData.forEach((data) => {
        if (data.universities && data.universities.length > 0) {
          data.universities.forEach((uni: any) => {
            if (
              uni.name === selectedUniversity &&
              uni.program &&
              uni.program.trim() !== ""
            ) {
              programs.add(uni.program);
            }
          });
        }
      });
    }

    return Array.from(programs).sort();
  }, [insightsData, selectedUniversity]);

  // Validate current selections against available options
  const validatedUniversity = useMemo(() => {
    if (
      selectedUniversity === "all" ||
      availableUniversities.includes(selectedUniversity)
    ) {
      return selectedUniversity;
    }
    return "all";
  }, [selectedUniversity, availableUniversities]);

  const validatedProgram = useMemo(() => {
    if (
      selectedProgram === "all" ||
      availablePrograms.includes(selectedProgram)
    ) {
      return selectedProgram;
    }
    return "all";
  }, [selectedProgram, availablePrograms]);

  // Predefined application statuses
  const applicationStatuses = [
    {
      value: "received_offer_and_accepted",
      label: "Received Offer and Accepted",
    },
    {
      value: "received_offer_and_rejected",
      label: "Received Offer and Rejected",
    },
    { value: "accepted", label: "Received Offer" },
    { value: "early_acceptance", label: "Early Acceptance" },
    { value: "waitlisted", label: "Waitlisted" },
    { value: "deferred", label: "Deferred" },
    { value: "rejected", label: "Rejected" },
    { value: "applied", label: "Applied" },
    { value: "planning_on_applying", label: "Planning on applying" },
  ];

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters - At the top */}
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
            {availableUniversities.length > 0 && (
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  University
                </label>
                <SearchableSelect
                  value={validatedUniversity}
                  onValueChange={(value) => {
                    setSelectedUniversity(value);
                    // If the current program is not available for the new university, reset it to "All"
                    if (value !== "all") {
                      const availableProgramsForUniversity = insightsData
                        .filter((data) =>
                          data.universities?.some(
                            (uni: any) => uni.name === value
                          )
                        )
                        .flatMap(
                          (data) =>
                            data.universities
                              ?.filter((uni: any) => uni.name === value)
                              .map((uni: any) => uni.program) || []
                        );

                      if (
                        !availableProgramsForUniversity.includes(
                          selectedProgram
                        ) &&
                        selectedProgram !== "all"
                      ) {
                        setSelectedProgram("all");
                      }
                    }
                  }}
                  placeholder="All Universities"
                  searchPlaceholder="Search universities..."
                  options={[
                    { value: "all", label: "All Universities" },
                    ...availableUniversities.map((university: string) => ({
                      value: university,
                      label: university,
                    })),
                  ]}
                />
              </div>
            )}

            {/* Program Filter */}
            {availablePrograms.length > 0 && (
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Program
                </label>
                <SearchableSelect
                  value={validatedProgram}
                  onValueChange={(value) => {
                    setSelectedProgram(value);
                    // If the current university is not available for the new program, reset it to "All"
                    if (value !== "all") {
                      const availableUniversitiesForProgram = insightsData
                        .filter((data) =>
                          data.universities?.some(
                            (uni: any) => uni.program === value
                          )
                        )
                        .flatMap(
                          (data) =>
                            data.universities
                              ?.filter((uni: any) => uni.program === value)
                              .map((uni: any) => uni.name) || []
                        );

                      if (
                        !availableUniversitiesForProgram.includes(
                          selectedUniversity
                        ) &&
                        selectedUniversity !== "all"
                      ) {
                        setSelectedUniversity("all");
                      }
                    }
                  }}
                  placeholder="All Programs"
                  searchPlaceholder="Search programs..."
                  options={[
                    { value: "all", label: "All Programs" },
                    ...availablePrograms.map((program: string) => ({
                      value: program,
                      label: program,
                    })),
                  ]}
                />
              </div>
            )}

            {/* Application Status Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Application Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {applicationStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Extracurriculars Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Extracurriculars
              </label>
              <Select
                value={selectedExtracurriculars}
                onValueChange={setSelectedExtracurriculars}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Records" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="has">Has Extracurriculars</SelectItem>
                  <SelectItem value="none">No Extracurriculars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Analysis - Based on filtered data */}
      <GradeStatistics2026 filteredData={filteredData} />

      {/* Results List */}
      <AdmissionInsightsList filteredData={filteredData} />
    </div>
  );
}

function GradeStatistics2026({ filteredData }: { filteredData: any[] }) {
  const gradeStats = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return { average: 0, median: 0, count: 0 };
    }

    // Transform filtered data to AdmissionRecord format
    // Each university/program combination is treated as a unique item
    const records = transformSupabaseDataToAdmissionRecords(filteredData);
    return calculateGradeStats(records);
  }, [filteredData]);

  if (!filteredData || filteredData.length === 0 || gradeStats.count === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Grade Analysis
          </CardTitle>
          <CardDescription>
            Average and median grades with distribution by acceptance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            No data available for the selected filters
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Grade Analysis
        </CardTitle>
        <CardDescription>
          Average and median grades with distribution by acceptance status
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

// Component to display the filtered results list
function AdmissionInsightsList({ filteredData }: { filteredData: any[] }) {
  const [expandedAchievements, setExpandedAchievements] = useState<Set<string>>(
    new Set()
  );

  // Predefined application statuses
  const applicationStatuses = [
    {
      value: "received_offer_and_accepted",
      label: "Received Offer and Accepted",
    },
    {
      value: "received_offer_and_rejected",
      label: "Received Offer and Rejected",
    },
    { value: "accepted", label: "Received Offer" },
    { value: "early_acceptance", label: "Early Acceptance" },
    { value: "waitlisted", label: "Waitlisted" },
    { value: "deferred", label: "Deferred" },
    { value: "rejected", label: "Rejected" },
    { value: "applied", label: "Applied" },
    { value: "planning_on_applying", label: "Planning on applying" },
  ];

  const getStatusLabel = (statusValue: string) => {
    const status = applicationStatuses.find((s) => s.value === statusValue);
    return status ? status.label : statusValue;
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
    return Math.round((sum / levelGrades.length) * 10) / 10;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "received_offer_and_accepted":
      case "accepted":
      case "early_acceptance":
        return "default";
      case "waitlisted":
      case "deferred":
        return "secondary";
      case "received_offer_and_rejected":
      case "rejected":
        return "destructive";
      case "applied":
      case "planning_on_applying":
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const exceedsFiveLines = (text: string) => {
    if (!text) return false;
    const lines = text.split("\n");
    return lines.length > 5;
  };

  const getTruncatedText = (text: string) => {
    if (!text) return "No achievements listed";
    const lines = text.split("\n");
    return lines.slice(0, 5).join("\n");
  };

  const toggleAchievements = (dataId: string) => {
    setExpandedAchievements((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dataId)) {
        newSet.delete(dataId);
      } else {
        newSet.add(dataId);
      }
      return newSet;
    });
  };

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No students match the selected filters.</p>
        <p className="text-sm text-gray-500 mt-2">
          Try adjusting your filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredData.map((data, index) => {
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
                          <p className="text-xs text-gray-600">{uni.program}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(uni.status)}>
                          {getStatusLabel(uni.status)}
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

              {/* Other Achievements */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <h4 className="font-semibold text-sm">Other Achievements</h4>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {exceedsFiveLines(data.other_achievements) &&
                    !expandedAchievements.has(data.id || index.toString())
                      ? getTruncatedText(data.other_achievements)
                      : data.other_achievements || "No achievements listed"}
                  </p>
                  {exceedsFiveLines(data.other_achievements) && (
                    <button
                      onClick={() =>
                        toggleAchievements(data.id || index.toString())
                      }
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
                    >
                      {expandedAchievements.has(data.id || index.toString()) ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          Show More
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Component to display admission insights (old - can be removed if not needed)
function AdmissionInsights() {
  const [insightsData, setInsightsData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedExtracurriculars, setSelectedExtracurriculars] =
    useState<string>("all");
  const [expandedAchievements, setExpandedAchievements] = useState<Set<string>>(
    new Set()
  );
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

    if (selectedStatus !== "all") {
      filtered = filtered.filter((data) =>
        data.universities?.some((uni: any) => uni.status === selectedStatus)
      );
    }

    if (selectedExtracurriculars !== "all") {
      const hasExtracurriculars = (data: any) => {
        return data.other_achievements && data.other_achievements.trim() !== "";
      };

      if (selectedExtracurriculars === "has") {
        filtered = filtered.filter(hasExtracurriculars);
      } else if (selectedExtracurriculars === "none") {
        filtered = filtered.filter((data) => !hasExtracurriculars(data));
      }
    }

    setFilteredData(filtered);
  }, [
    insightsData,
    selectedUniversity,
    selectedProgram,
    selectedStatus,
    selectedExtracurriculars,
  ]);

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

  // Predefined application statuses matching the submit form
  const applicationStatuses = [
    {
      value: "received_offer_and_accepted",
      label: "Received Offer and Accepted",
    },
    {
      value: "received_offer_and_rejected",
      label: "Received Offer and Rejected",
    },
    { value: "accepted", label: "Received Offer" },
    { value: "early_acceptance", label: "Early Acceptance" },
    { value: "waitlisted", label: "Waitlisted" },
    { value: "deferred", label: "Deferred" },
    { value: "rejected", label: "Rejected" },
    { value: "applied", label: "Applied" },
    { value: "planning_on_applying", label: "Planning on applying" },
  ];

  // Helper function to get status label from value
  const getStatusLabel = (statusValue: string) => {
    const status = applicationStatuses.find((s) => s.value === statusValue);
    return status ? status.label : statusValue;
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
      case "received_offer_and_accepted":
      case "accepted":
      case "early_acceptance":
        return "default";
      case "waitlisted":
      case "deferred":
        return "secondary";
      case "received_offer_and_rejected":
      case "rejected":
        return "destructive";
      case "applied":
      case "planning_on_applying":
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  // Helper function to check if text exceeds 5 lines
  const exceedsFiveLines = (text: string) => {
    if (!text) return false;
    const lines = text.split("\n");
    return lines.length > 5;
  };

  // Helper function to get truncated text (first 5 lines)
  const getTruncatedText = (text: string) => {
    if (!text) return "No achievements listed";
    const lines = text.split("\n");
    return lines.slice(0, 5).join("\n");
  };

  // Toggle expanded state for achievements
  const toggleAchievements = (dataId: string) => {
    setExpandedAchievements((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dataId)) {
        newSet.delete(dataId);
      } else {
        newSet.add(dataId);
      }
      return newSet;
    });
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
                    {uniqueUniversities.map((university: string) => (
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
                    {uniquePrograms.map((program: string) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Application Status Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Application Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {applicationStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Extracurriculars Filter */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Extracurriculars
              </label>
              <Select
                value={selectedExtracurriculars}
                onValueChange={setSelectedExtracurriculars}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Records" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="has">Has Extracurriculars</SelectItem>
                  <SelectItem value="none">No Extracurriculars</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                            {getStatusLabel(uni.status)}
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
                  <div className="bg-yellow-50 p-2 rounded">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {exceedsFiveLines(data.other_achievements) &&
                      !expandedAchievements.has(data.id || index.toString())
                        ? getTruncatedText(data.other_achievements)
                        : data.other_achievements || "No achievements listed"}
                    </p>
                    {exceedsFiveLines(data.other_achievements) && (
                      <button
                        onClick={() =>
                          toggleAchievements(data.id || index.toString())
                        }
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
                      >
                        {expandedAchievements.has(
                          data.id || index.toString()
                        ) ? (
                          <>
                            <ChevronUp className="w-3 h-3" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            Show More
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
