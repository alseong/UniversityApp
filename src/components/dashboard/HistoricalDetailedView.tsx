"use client";

import { useState, useMemo } from "react";
import { AdmissionRecord } from "@/types/dashboard";
import {
  applyHistoricalFilters,
  HistoricalDetailedFilter,
} from "@/utils/historicalFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Filter, TrendingUp, GraduationCap } from "lucide-react";
import { calculateGradeStats } from "@/utils/statistics";
import { filterValidRecords } from "@/utils/filters";

type Props = {
  records: AdmissionRecord[];
  year: string;
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

export default function HistoricalDetailedView({ records, year }: Props) {
  const [filters, setFilters] = useState<HistoricalDetailedFilter>({
    school: "All",
    program: "All",
    status: "All",
  });

  const filteredRecords = useMemo(
    () => applyHistoricalFilters(records, year, filters),
    [records, year, filters]
  );

  const availableSchools = useMemo(() => {
    const yearRecords = records.filter(
      (r) => year === "All" || r["Attending Year"] === year
    );
    const schools = new Set<string>();
    yearRecords.forEach((r) => r.School.forEach((s) => schools.add(s)));
    return ["All", ...Array.from(schools).sort()];
  }, [records, year]);

  const availablePrograms = useMemo(() => {
    const yearRecords = records.filter(
      (r) => year === "All" || r["Attending Year"] === year
    );
    const programs = new Set<string>();
    yearRecords.forEach((r) => r.Program.forEach((p) => programs.add(p)));
    return ["All", ...Array.from(programs).sort()];
  }, [records, year]);

  const availableStatuses = useMemo(() => {
    const yearRecords = records.filter(
      (r) => year === "All" || r["Attending Year"] === year
    );
    const statuses = new Set<string>();
    yearRecords.forEach((r) => statuses.add(r.Status));
    return ["All", ...Array.from(statuses).sort()];
  }, [records, year]);

  const gradeStats = useMemo(
    () => calculateGradeStats(filterValidRecords(filteredRecords)),
    [filteredRecords]
  );

  if (filteredRecords.length === 0) {
    return (
      <div className="space-y-4">
        <FiltersCard
          filters={filters}
          onFiltersChange={setFilters}
          availableSchools={availableSchools}
          availablePrograms={availablePrograms}
          availableStatuses={availableStatuses}
        />
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p>No records found for the selected filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FiltersCard
        filters={filters}
        onFiltersChange={setFilters}
        availableSchools={availableSchools}
        availablePrograms={availablePrograms}
        availableStatuses={availableStatuses}
      />

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
                {filteredRecords.length}
              </div>
              <div className="text-sm text-purple-600">
                {filteredRecords.length === 1 ? "1 record" : `${filteredRecords.length} records`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records */}
      <div className="space-y-4">
        {filteredRecords.map((record, idx) => (
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

function FiltersCard({
  filters,
  onFiltersChange,
  availableSchools,
  availablePrograms,
  availableStatuses,
}: {
  filters: HistoricalDetailedFilter;
  onFiltersChange: (f: HistoricalDetailedFilter) => void;
  availableSchools: string[];
  availablePrograms: string[];
  availableStatuses: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4 text-blue-600" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">School</label>
            <SearchableSelect
              value={filters.school}
              onValueChange={(v) => onFiltersChange({ ...filters, school: v })}
              placeholder="All Schools"
              searchPlaceholder="Search schools..."
              options={availableSchools.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Program</label>
            <SearchableSelect
              value={filters.program}
              onValueChange={(v) => onFiltersChange({ ...filters, program: v })}
              placeholder="All Programs"
              searchPlaceholder="Search programs..."
              options={availablePrograms.map((p) => ({ value: p, label: p }))}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select
              value={filters.status}
              onValueChange={(v) => onFiltersChange({ ...filters, status: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
