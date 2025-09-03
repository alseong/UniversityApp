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
import { BarChart3, Users, TrendingUp, AlertCircle } from "lucide-react";

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
                  attending university in 2026
                </p>
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
                  Complete Your Profile to View Insights
                </CardTitle>
                <CardDescription className="text-lg">
                  To see live 2026 admission insights and trends for students
                  planning to attend university in 2026, you need to add your
                  university applications and grades first.
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
                    <span>Add at least 1 university application</span>
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

                <p className="text-sm text-gray-500">
                  Once you've added your information, you'll be able to see live
                  insights and compare your profile with other students planning
                  to attend university in 2026.
                </p>
              </CardContent>
            </Card>
          ) : (
            /* Insights coming soon message */
            <div className="max-w-4xl mx-auto space-y-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">
                    Insights Are Coming In!
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Live admission insights and trends for students planning to
                    attend university in 2026 are coming soon. Check back for
                    real-time updates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4">
                      <div className="mx-auto mb-2 p-2 bg-green-100 rounded-full w-fit">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        Growing
                      </div>
                      <div className="text-sm text-gray-600">
                        Student submissions
                      </div>
                    </div>
                    <div className="text-center p-4">
                      <div className="mx-auto mb-2 p-2 bg-blue-100 rounded-full w-fit">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        Soon
                      </div>
                      <div className="text-sm text-gray-600">Live insights</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="mx-auto mb-2 p-2 bg-purple-100 rounded-full w-fit">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        Real-time
                      </div>
                      <div className="text-sm text-gray-600">Data updates</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-3">
                      What to Expect
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Programs students plan to apply to</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Application statuses and timelines</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Admission rates by program</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Grade distributions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Program competitiveness trends</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>LIVE admission updates</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/submit-data")}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    Update Your Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
