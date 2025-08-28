"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";
import { RankingItem } from "@/types/dashboard";
import { useProcessedAdmissionData } from "@/utils/data";
import { calculatePopularityRankings } from "@/utils/statistics";

export default function PopularSchools() {
  const { allRecords } = useProcessedAdmissionData();

  const schoolStats = useMemo((): RankingItem[] => {
    return calculatePopularityRankings(allRecords, "school");
  }, [allRecords]);

  const getPopularityLevel = (count: number): string => {
    if (count >= 500) return "Extremely Popular";
    if (count >= 200) return "Very Popular";
    if (count >= 100) return "Popular";
    if (count >= 50) return "Moderate";
    return "Low";
  };

  const getCountColor = (count: number): string => {
    if (count >= 500) return "text-red-600 bg-red-50";
    if (count >= 200) return "text-orange-600 bg-orange-50";
    if (count >= 100) return "text-yellow-600 bg-yellow-50";
    if (count >= 50) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-600" />
          Most Popular Schools
        </CardTitle>
        <CardDescription>
          Ranked by total number of applications
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <div className="relative">
          <div className="h-64 overflow-y-auto space-y-3 mb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {schoolStats.map((school, index) => (
              <div
                key={school.name}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{school.name}</div>
                    <div className="text-xs text-gray-500">
                      {school.acceptanceRate}% acceptance rate
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-2 py-1 rounded text-sm font-semibold ${getCountColor(school.applicationCount || 0)}`}
                  >
                    {school.applicationCount}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getPopularityLevel(school.applicationCount || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Scroll indicator gradient */}
          <div className="absolute bottom-4 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
          {/* Scroll hint */}
          <div className="absolute bottom-1 right-2 text-xs text-gray-400 flex items-center gap-1">
            <span>Scroll for more</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        <div className="pt-4 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            More applications = more popular choice
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
