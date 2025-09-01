"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BarChart3, TrendingUp, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import GradeStatistics from "@/components/grade-statistics";
import CompetitivePrograms from "@/components/competitive-programs";
import CompetitiveUniversities from "@/components/competitive-universities";
import PopularSchools from "@/components/popular-schools";
import PopularPrograms from "@/components/popular-programs";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, [router]);

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
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back! Here's an overview of admission data and insights.
            </p>
          </header>

          {/* Dashboard Cards */}
          <div className="space-y-6 mb-8">
            {/* 2026 School Year Preparation - Full Width */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl text-blue-800">
                      🎯 Preparing for 2026 School Year Applications
                    </CardTitle>
                    <CardDescription className="text-blue-700 text-base sm:text-lg">
                      Help us build the most accurate and comprehensive
                      university admission data platform
                    </CardDescription>
                  </div>
                  <Link href="/submit-data" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-base">
                      Share Admissions Data
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto text-left font-semibold text-lg text-blue-800 hover:bg-transparent"
                    >
                      Our Goals & How You Can Help
                      <ChevronDown className="w-5 h-5 transition-transform duration-200" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-6 mt-3 pl-4 border-l-2 border-blue-200">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-800">
                        Our Goal for 2026
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-blue-700">
                            Most Accurate Data: Real-time admission results from
                            students across Canada
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-blue-700">
                            2026 Application Updates: Live tracking of admission
                            decisions and trends
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-blue-700">
                            Best Resource: The go-to platform for checking 2026
                            application results
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-800">
                        How You Can Help
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-blue-700">
                            Submit Your Data: Share your admission results in
                            "Your Admissions Data"
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-blue-700">
                            Stay Updated: Get early access to new features and
                            insights
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-blue-700">
                            Community Impact: Share with your peers
                          </p>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            {/* Grade Analysis - Full Width */}
            <GradeStatistics />

            {/* First Row - 3 widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CompetitivePrograms />
              <CompetitiveUniversities />
              <PopularSchools />
            </div>

            {/* Second Row - 1 widget */}
            <div className="grid grid-cols-1 gap-6">
              <PopularPrograms />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
