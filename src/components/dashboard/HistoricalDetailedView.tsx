"use client";

import { useMemo } from "react";
import { AdmissionRecord } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, GraduationCap } from "lucide-react";
import { calculateGradeStats } from "@/utils/statistics";
import { filterValidRecords } from "@/utils/filters";

type Props = {
  records: AdmissionRecord[];
};

const getStatusBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  const s = status.toLowerCase();
  if (s === "accepted") return "default";
  if (s === "waitlisted" || s === "deferred") return "secondary";
  if (s === "rejected") return "destructive";
  return "outline";
};

export default function HistoricalDetailedView({ records }: Props) {
  const gradeStats = useMemo(
    () => calculateGradeStats(filterValidRecords(records)),
    [records]
  );

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
        <p>No records found for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Grade Analysis
          </CardTitle>
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
                {records.length}
              </div>
              <div className="text-sm text-purple-600">
                {records.length === 1 ? "1 record" : `${records.length} records`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records */}
      <div className="space-y-4">
        {records.map((record, idx) => (
          <Card key={idx}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="font-medium text-sm">
                      {record.School.join(", ")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {record.Program.join(", ")}
                  </p>
                  {record.Average !== null && (
                    <p className="text-sm text-muted-foreground pl-6">
                      Average: {record.Average}%
                    </p>
                  )}
                </div>
                <Badge variant={getStatusBadgeVariant(record.Status)}>
                  {record.Status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
