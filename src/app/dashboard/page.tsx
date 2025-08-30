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
            {/* Grade Analysis - Full Width */}
            <GradeStatistics />

            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Enhanced Coming Soon Widget */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Improvements Coming Soon!
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Help us build the most comprehensive university admission
                    insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>
                        Analyze how universities evaluate grade inflation
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Grade averages for specific subjects</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>And more - please submit your feedback!</span>
                    </div>
                  </div>

                  <div className="bg-blue-600 bg-opacity-10 rounded-lg p-4 text-center">
                    <p className="text-sm text-blue-800 font-medium mb-3">
                      🤝 Help us make this possible!
                    </p>
                    <p className="text-xs text-blue-700 mb-4">
                      More student data = better insights for everyone
                    </p>
                    <Link href="/submit-data">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Share Admissions Information
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <CompetitivePrograms />
              <CompetitiveUniversities />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PopularSchools />
              <PopularPrograms />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
