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

          {/* Coming Soon Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Admission Statistics
                </CardTitle>
                <CardDescription>
                  University acceptance rates and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="animate-pulse bg-gray-200 h-24 w-full rounded mb-4"></div>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Grade Analysis
                </CardTitle>
                <CardDescription>
                  Compare your grades with successful applicants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="animate-pulse bg-gray-200 h-24 w-full rounded mb-4"></div>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Peer Insights
                </CardTitle>
                <CardDescription>
                  See how others with similar profiles performed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="animate-pulse bg-gray-200 h-24 w-full rounded mb-4"></div>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Message */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Dashboard Coming Soon!</CardTitle>
              <CardDescription className="text-lg">
                We'll notify you as soon as we're ready!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 max-w-2xl mx-auto">
                Once we collect enough data, we'll show you admission trends and
                insights for your university admissions.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Help us build this together!
                </h3>
                <p className="text-blue-800 text-sm mb-4">
                  The more students who share their admission data, the better
                  insights we can provide to help future applicants succeed.
                </p>
                <Link href="/submit-data">
                  <Button className="inline-flex items-center gap-2">
                    Share Your Admission Data
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
