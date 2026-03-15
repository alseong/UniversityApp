"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../../supabase/client";
import DashboardNavbar from "@/components/dashboard-navbar";
import GradeStatistics from "@/components/grade-statistics";
import CompetitivePrograms from "@/components/competitive-programs";
import CompetitiveUniversities from "@/components/competitive-universities";
import PopularSchools from "@/components/popular-schools";
import PopularPrograms from "@/components/popular-programs";
import ViewToggle from "@/components/dashboard/ViewToggle";
import HistoricalDetailedView from "@/components/dashboard/HistoricalDetailedView";
import LiveDetailedView from "@/components/dashboard/LiveDetailedView";
import { useProcessedAdmissionData } from "@/utils/data";
import { checkUserHasSufficientData, UserData } from "@/utils/auth";
import ProfileCompletionModal from "@/components/profile-completion-modal";

type View = "summary" | "detailed";

function Dashboard() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>(
    searchParams.get("view") === "detailed" ? "detailed" : "summary"
  );
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [hasSufficientData, setHasSufficientData] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);
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
      const { hasSufficientData: hasData, userData: data } =
        await checkUserHasSufficientData(user.id);
      setHasSufficientData(hasData);
      setUserData(data);
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleViewChange = (view: View) => {
    if (view === "detailed" && !hasSufficientData) {
      setShowModal(true);
      return;
    }
    setActiveView(view);
  };

  const { allRecords, attendingYears } = useProcessedAdmissionData();

  const historicalYears = useMemo(
    () =>
      attendingYears
        .filter((y) => y !== "All")
        .sort((a, b) => Number(b) - Number(a)),
    [attendingYears]
  );

  const liveYears = ["2027", "2026"];

  const yearTabs = useMemo(
    () => [...liveYears, ...historicalYears],
    [historicalYears]
  );

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <ProfileCompletionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userData={userData}
      />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground mb-4">
              Admission data and insights from students across Canada.
            </p>
            <ViewToggle activeView={activeView} onChange={handleViewChange} />
          </header>

          {activeView === "summary" ? (
            <div className="space-y-6">
              <GradeStatistics />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CompetitivePrograms />
                <CompetitiveUniversities />
                <PopularSchools />
              </div>
              <PopularPrograms />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Year Tabs */}
              <div className="flex flex-wrap gap-2">
                {yearTabs.map((year) => {
                  const isDisabled = !liveYears.includes(year);
                  return (
                    <button
                      key={year}
                      onClick={() => !isDisabled && setSelectedYear(year)}
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        isDisabled
                          ? "bg-muted text-muted-foreground border-border opacity-40 cursor-not-allowed"
                          : selectedYear === year
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-background text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {year}
                        {liveYears.includes(year) && (
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Content */}
              {liveYears.includes(selectedYear) ? (
                <LiveDetailedView year={selectedYear} />
              ) : (
                <HistoricalDetailedView
                  records={allRecords}
                  year={selectedYear}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
