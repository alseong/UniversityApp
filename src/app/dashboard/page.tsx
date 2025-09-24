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
          {/* Webinar Card - Full Width */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl sm:text-2xl text-blue-800">
                    Register to our live webinar!
                  </CardTitle>
                  <CardDescription className="text-blue-700 text-base sm:text-lg">
                    Skip the brochures! Real university grads spill the tea on
                    admissions, campus life & tech careers. Your burning
                    questions answered live!
                  </CardDescription>
                </div>
                <Link
                  href="https://www.eventbrite.ca/e/university-of-waterloo-alumni-panel-live-ama-tickets-1732699614189?aff=oddtdtcreator"
                  className="w-full sm:w-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-base">
                    Register
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
                    Key Details
                    <ChevronDown className="w-5 h-5 transition-transform duration-200" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 mt-3 pl-4 border-l-2 border-blue-200">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-800">
                      Free Webinar Access
                    </h4>
                    <p className="text-blue-700 mb-3">
                      Attend this webinar for free by:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-blue-700">
                          Add at least 1 university and program you are
                          interested in or already applied to
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-blue-700">
                          Add grades (6+ individual grades preferred, or at
                          least 1 average grade)
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-blue-700">
                          Refer 2 friends who also sign up and add their data
                          (they can enter your email when signing up)
                        </p>
                      </div>
                    </div>
                    <p className="text-blue-700 text-sm mt-3">
                      If you don't complete referrals, we'll notify you about
                      the $10 payment one week before. Parents attend free!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-800">
                      Submit Your Questions
                    </h4>
                    <p className="text-blue-700">
                      We'll use your question submissions to tailor the webinar
                      content for maximum value. While this session focuses on
                      University of Waterloo, we're planning webinars for other
                      universities soon - let us know which ones interest you!
                    </p>
                    <Link
                      href="https://forms.gle/ewXnqhJpGBQmUZes8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                      >
                        Submit Questions
                      </Button>
                    </Link>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Header Section */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back! Here's an overview of admission data and insights
              from students across Canada.
            </p>
          </header>

          {/* Dashboard Cards */}
          <div className="space-y-6 mb-8">
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
