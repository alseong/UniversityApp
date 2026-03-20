"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "../../../supabase/client";
import { formatAttendanceYear } from "@/utils/formatAttendanceYear";
import HistoricalDetailedView from "./HistoricalDetailedView";
import { AdmissionRecord } from "@/types/dashboard";
import { applyHistoricalFilters, HistoricalDetailedFilter } from "@/utils/historicalFilters";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search, AlertCircle, Filter, TrendingUp, Users, GraduationCap, BookOpen, Award, ChevronDown, ChevronUp, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentSection } from "@/components/comments/CommentSection";
import ProfileCompletionModal from "@/components/profile-completion-modal";
import LikeButton from "@/components/LikeButton";

const normalizeHighSchool = (str: string) =>
  str.replace(/[^a-zA-Z]/g, "").toLowerCase();

const APPLICATION_STATUSES = [
  { value: "received_offer_and_accepted", label: "Offer and Accepted" },
  { value: "received_offer_and_rejected", label: "Offer and Rejected" },
  { value: "accepted", label: "Offer" },
  { value: "early_acceptance", label: "Early Offer" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "deferred", label: "Deferred" },
  { value: "rejected", label: "Rejected" },
  { value: "applied", label: "Applied" },
  { value: "planning_on_applying", label: "Planning on applying" },
];

const getStatusLabel = (value: string) =>
  APPLICATION_STATUSES.find((s) => s.value === value)?.label ?? value;

const getStatusBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
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
    default:
      return "outline";
  }
};

function HighSchoolSearchableSelect({
  selectedHighSchool,
  setSelectedHighSchool,
  availableHighSchools,
}: {
  selectedHighSchool: string;
  setSelectedHighSchool: (value: string) => void;
  availableHighSchools: string[];
}) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (searchValue.trim()) {
        const normalized = normalizeHighSchool(searchValue);
        const next = `search_match:${normalized}`;
        if (selectedHighSchool !== next) setSelectedHighSchool(next);
      } else if (selectedHighSchool.startsWith("search_match:")) {
        setSelectedHighSchool("all");
      }
    }, 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const filteredOptions = useMemo(() => {
    const normalizedSearch = searchValue ? normalizeHighSchool(searchValue) : "";
    const matching = availableHighSchools.filter((hs) =>
      normalizedSearch ? normalizeHighSchool(hs).includes(normalizedSearch) : true
    );
    const options: { value: string; label: string }[] = [
      { value: "all", label: "All High Schools" },
    ];
    if (normalizedSearch) {
      options.push({ value: `search_match:${normalizedSearch}`, label: "Search all matching results" });
    }
    options.push(...matching.map((hs) => ({ value: hs, label: hs })));
    return options;
  }, [availableHighSchools, searchValue]);

  const handleSelect = (val: string) => {
    if (val === "all") { setSearchValue(""); setSelectedHighSchool("all"); }
    else if (val.startsWith("search_match:")) { setSelectedHighSchool(val); }
    else { setSearchValue(""); setSelectedHighSchool(val); }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-10 px-3 py-2">
          <span className="truncate text-left">
            {selectedHighSchool === "all" ? "All High Schools"
              : selectedHighSchool.startsWith("search_match:") ? "Search all matching results"
              : availableHighSchools.find((hs) => hs === selectedHighSchool) || "All High Schools"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search high schools..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-1">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm">No high school found.</div>
          ) : (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect(opt.value)}
              >
                <Check className={cn("mr-2 h-4 w-4", selectedHighSchool === opt.value ? "opacity-100" : "opacity-0")} />
                {opt.label}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}


const PAGE_SIZE = 15;

function RecordsList({ filteredData, currentUserId }: { filteredData: any[]; currentUserId: string | null }) {
  const [expandedAchievements, setExpandedAchievements] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredData]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredData.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredData.length]);

  const calculateAverageGrade = (grades: any[], level: string) => {
    const levelGrades = grades.filter((g) => g.level === level && g.grade !== null && g.grade !== "");
    if (!levelGrades.length) return null;
    return Math.round((levelGrades.reduce((acc, g) => acc + Number(g.grade), 0) / levelGrades.length) * 10) / 10;
  };

  const exceedsFiveLines = (text: string) => text?.split("\n").length > 5;
  const getTruncatedText = (text: string) => text?.split("\n").slice(0, 5).join("\n");

  const toggleAchievements = (id: string) => {
    setExpandedAchievements((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (!filteredData.length) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
        <p className="text-muted-foreground">No students match the selected filters.</p>
      </div>
    );
  }

  const visibleData = filteredData.slice(0, visibleCount);
  const hasMore = visibleCount < filteredData.length;

  return (
    <div className="space-y-6">
      {visibleData.map((data, index) => {
        const avgGrade11 = data.avg_grade_11 ? Number(data.avg_grade_11) : calculateAverageGrade(data.grades || [], "grade_11");
        const avgGrade12 = data.avg_grade_12 ? Number(data.avg_grade_12) : calculateAverageGrade(data.grades || [], "grade_12");
        const grade11Courses = (data.grades || []).filter((g: any) => g.level === "grade_11" && g.grade !== null && g.grade !== "");
        const grade12Courses = (data.grades || []).filter((g: any) => g.level === "grade_12" && g.grade !== null && g.grade !== "");
        const itemId = data.id || index.toString();

        return (
          <Card key={itemId} className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{formatAttendanceYear(data.university_attendance || "") || "University Student"}</CardTitle>
                </div>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  User: {data.user_id?.slice(-6) || "Unknown"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.high_school && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <School className="h-4 w-4 text-indigo-600" />
                    <h4 className="font-semibold text-sm">High School</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{data.high_school}</p>
                </div>
              )}

              {data.universities?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-sm">Universities & Programs</h4>
                  </div>
                  <div className="space-y-2">
                    {data.universities.map((uni: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="font-medium text-sm">{uni.name}</p>
                          <p className="text-xs text-muted-foreground">{uni.program}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(uni.status)}>
                          {getStatusLabel(uni.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {avgGrade11 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <h4 className="font-semibold text-sm">Average Grade 11: {avgGrade11}%</h4>
                  </div>
                  {grade11Courses.length > 0 && (
                    <div className="space-y-1">
                      {grade11Courses.map((c: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs text-muted-foreground">
                          <span>{c.courseName} ({c.courseCode})</span>
                          <span>{c.grade}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {avgGrade12 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <h4 className="font-semibold text-sm">Average Grade 12: {avgGrade12}%</h4>
                  </div>
                  {grade12Courses.length > 0 && (
                    <div className="space-y-1">
                      {grade12Courses.map((c: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs text-muted-foreground">
                          <span>{c.courseName} ({c.courseCode})</span>
                          <span>{c.grade}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <h4 className="font-semibold text-sm">Other Achievements</h4>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {exceedsFiveLines(data.other_achievements) && !expandedAchievements.has(itemId)
                      ? getTruncatedText(data.other_achievements)
                      : data.other_achievements || "No achievements listed"}
                  </p>
                  {exceedsFiveLines(data.other_achievements) && (
                    <button
                      onClick={() => toggleAchievements(itemId)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
                    >
                      {expandedAchievements.has(itemId) ? (
                        <><ChevronUp className="w-3 h-3" />Show Less</>
                      ) : (
                        <><ChevronDown className="w-3 h-3" />Show More</>
                      )}
                    </button>
                  )}
                </div>
              </div>
              {data.id && (
                <CommentSection
                  submissionId={data.id}
                  currentUserId={currentUserId}
                  leading={<LikeButton submissionId={data.id} userId={currentUserId} />}
                />
              )}
            </CardContent>
          </Card>
        );
      })}
      <div ref={sentinelRef} className="py-4 text-center text-sm text-muted-foreground">
        {hasMore ? "Loading more..." : null}
      </div>
    </div>
  );
}

type Props = {
  allRecords: AdmissionRecord[];
  liveYears: string[];
  historicalYears: string[];
  hasSufficientData?: boolean;
  userData?: any;
};

export default function LiveDetailedView({ allRecords, liveYears, historicalYears, hasSufficientData = true, userData = null }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    () => liveYears[liveYears.length - 1] ?? liveYears[0] ?? ""
  );
  const [insightsData, setInsightsData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedExtracurriculars, setSelectedExtracurriculars] = useState("all");
  const [selectedHighSchool, setSelectedHighSchool] = useState("all");
  const [historicalFilters, setHistoricalFilters] = useState<HistoricalDetailedFilter>({
    school: "All",
    program: "All",
    status: "All",
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();

  const guardedChange = (setter: (v: string) => void) => (v: string) => {
    if (!hasSufficientData) { setShowModal(true); return; }
    setter(v);
  };
  const guardedSetHighSchool = (v: string) => {
    if (!hasSufficientData) { setShowModal(true); return; }
    setSelectedHighSchool(v);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from("admissions_data")
          .select("*")
          .order("created_at", { ascending: false })
          .ilike("university_attendance", `%${selectedYear}%`)
          .limit(10000);
        if (err) throw err;
        setInsightsData(data || []);
        setFilteredData(data || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectedYear]);

  useEffect(() => {
    setHistoricalFilters({ school: "All", program: "All", status: "All" });
  }, [selectedYear]);

  const isLiveYear = liveYears.includes(selectedYear);
  const isHistoricalYear = !isLiveYear;

  const historicalFilteredRecords = useMemo(() => {
    if (!isHistoricalYear) return [];
    return applyHistoricalFilters(allRecords, selectedYear, historicalFilters);
  }, [allRecords, selectedYear, historicalFilters, isHistoricalYear]);

  const availableHistoricalSchools = useMemo(() => {
    if (!isHistoricalYear) return [];
    const yearRecords = allRecords.filter((r) => r["Attending Year"] === selectedYear);
    const schools = new Set<string>();
    yearRecords.forEach((r) => r.School.forEach((s) => schools.add(s)));
    return ["All", ...Array.from(schools).sort()];
  }, [allRecords, selectedYear, isHistoricalYear]);

  const availableHistoricalPrograms = useMemo(() => {
    if (!isHistoricalYear) return [];
    const yearRecords = allRecords.filter((r) => r["Attending Year"] === selectedYear);
    const programs = new Set<string>();
    yearRecords.forEach((r) => r.Program.forEach((p) => programs.add(p)));
    return ["All", ...Array.from(programs).sort()];
  }, [allRecords, selectedYear, isHistoricalYear]);

  const availableHistoricalStatuses = useMemo(() => {
    if (!isHistoricalYear) return [];
    const yearRecords = allRecords.filter((r) => r["Attending Year"] === selectedYear);
    const statuses = new Set<string>();
    yearRecords.forEach((r) => statuses.add(r.Status));
    return ["All", ...Array.from(statuses).sort()];
  }, [allRecords, selectedYear, isHistoricalYear]);

  useEffect(() => {
    let filtered = insightsData.filter((data) => {
      const hasUniversities = data.universities?.some(
        (u: any) => u.name?.trim() && u.program?.trim()
      );
      const hasAchievements = data.other_achievements?.trim();
      return hasUniversities || hasAchievements;
    });

    if (selectedUniversity !== "all") {
      filtered = filtered.filter((d) => d.universities?.some((u: any) => u.name === selectedUniversity));
    }
    if (selectedProgram !== "all") {
      filtered = filtered.filter((d) => d.universities?.some((u: any) => u.program === selectedProgram));
    }
    if (selectedStatus !== "all") {
      filtered = filtered.filter((d) => d.universities?.some((u: any) => u.status === selectedStatus));
    }
    if (selectedExtracurriculars !== "all") {
      const hasEc = (d: any) => d.other_achievements?.trim();
      filtered = selectedExtracurriculars === "has"
        ? filtered.filter(hasEc)
        : filtered.filter((d) => !hasEc(d));
    }
    if (selectedHighSchool !== "all") {
      if (selectedHighSchool.startsWith("search_match:")) {
        const term = selectedHighSchool.replace("search_match:", "");
        filtered = filtered.filter((d) => d.high_school && normalizeHighSchool(d.high_school).includes(term));
      } else {
        const norm = normalizeHighSchool(selectedHighSchool);
        filtered = filtered.filter((d) => d.high_school && normalizeHighSchool(d.high_school) === norm);
      }
    }

    setFilteredData(filtered);
  }, [insightsData, selectedUniversity, selectedProgram, selectedStatus, selectedExtracurriculars, selectedHighSchool]);

  const availableUniversities = useMemo(() => {
    const set = new Set<string>();
    insightsData.forEach((d) => {
      if (d.universities?.some((u: any) => u.name?.trim() && u.program?.trim()) || d.other_achievements?.trim()) {
        d.universities?.forEach((u: any) => { if (u.name?.trim()) set.add(u.name); });
      }
    });
    return Array.from(set).sort();
  }, [insightsData]);

  const availablePrograms = useMemo(() => {
    const set = new Set<string>();
    insightsData.forEach((d) => {
      if (d.universities?.some((u: any) => u.name?.trim() && u.program?.trim()) || d.other_achievements?.trim()) {
        d.universities?.forEach((u: any) => { if (u.program?.trim()) set.add(u.program); });
      }
    });
    return Array.from(set).sort();
  }, [insightsData]);

  const availableHighSchools = useMemo(() => {
    const set = new Set<string>();
    insightsData.forEach((d) => { if (d.high_school?.trim()) set.add(d.high_school); });
    return Array.from(set).sort();
  }, [insightsData]);

  const validatedUniversity = useMemo(() => (
    selectedUniversity === "all" || availableUniversities.includes(selectedUniversity) ? selectedUniversity : "all"
  ), [selectedUniversity, availableUniversities]);

  const validatedProgram = useMemo(() => (
    selectedProgram === "all" || availablePrograms.includes(selectedProgram) ? selectedProgram : "all"
  ), [selectedProgram, availablePrograms]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
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
      <Card>
        <CardHeader
          className="cursor-pointer select-none"
          onClick={() => setFiltersOpen((prev) => !prev)}
        >
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4 text-blue-600" />
            Filters
            {filtersOpen ? (
              <ChevronUp className="h-4 w-4 ml-auto text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
            )}
          </CardTitle>
        </CardHeader>
        {filtersOpen && (
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="w-full">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Year</label>
              <div className="flex flex-wrap gap-2">
                {[...liveYears, ...historicalYears].map((year) => {
                  const isHistorical = !liveYears.includes(year);
                  return (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      disabled={isHistorical}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        isHistorical
                          ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground border-border"
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
            </div>
            {isLiveYear && availableUniversities.length > 0 && (
              <div className="flex-1 min-w-[160px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">University</label>
                <SearchableSelect
                  value={validatedUniversity}
                  onValueChange={(v) => {
                    setSelectedUniversity(v);
                    if (v !== "all") {
                      const available = insightsData
                        .filter((d) => d.universities?.some((u: any) => u.name === v))
                        .flatMap((d) => d.universities?.filter((u: any) => u.name === v).map((u: any) => u.program) || []);
                      if (!available.includes(selectedProgram) && selectedProgram !== "all") setSelectedProgram("all");
                    }
                  }}
                  placeholder="All Universities"
                  searchPlaceholder="Search universities..."
                  options={[{ value: "all", label: "All Universities" }, ...availableUniversities.map((u) => ({ value: u, label: u }))]}
                />
              </div>
            )}

            {isLiveYear && availablePrograms.length > 0 && (
              <div className="flex-1 min-w-[160px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Program</label>
                <SearchableSelect
                  value={validatedProgram}
                  onValueChange={guardedChange((v) => {
                    setSelectedProgram(v);
                    if (v !== "all") {
                      const available = insightsData
                        .filter((d) => d.universities?.some((u: any) => u.program === v))
                        .flatMap((d) => d.universities?.filter((u: any) => u.program === v).map((u: any) => u.name) || []);
                      if (!available.includes(selectedUniversity) && selectedUniversity !== "all") setSelectedUniversity("all");
                    }
                  })}
                  placeholder="All Programs"
                  searchPlaceholder="Search programs..."
                  options={[{ value: "all", label: "All Programs" }, ...availablePrograms.map((p) => ({ value: p, label: p }))]}
                />
              </div>
            )}

            {isLiveYear && (
              <div className="flex-1 min-w-[160px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Application Status</label>
                <Select value={selectedStatus} onValueChange={guardedChange(setSelectedStatus)}>
                  <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="all">All Statuses</SelectItem>
                    {APPLICATION_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {isLiveYear && (
              <div className="flex-1 min-w-[160px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Extracurriculars</label>
                <Select value={selectedExtracurriculars} onValueChange={guardedChange(setSelectedExtracurriculars)}>
                  <SelectTrigger><SelectValue placeholder="All Records" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Records</SelectItem>
                    <SelectItem value="has">Has Extracurriculars</SelectItem>
                    <SelectItem value="none">No Extracurriculars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {isLiveYear && availableHighSchools.length > 0 && (
              <div className="flex-1 min-w-[160px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">High School</label>
                <HighSchoolSearchableSelect
                  selectedHighSchool={selectedHighSchool}
                  setSelectedHighSchool={guardedSetHighSchool}
                  availableHighSchools={availableHighSchools}
                />
              </div>
            )}

            {isHistoricalYear && availableHistoricalSchools.length > 1 && (
              <div className="flex-1 min-w-[160px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">School</label>
                <SearchableSelect
                  value={historicalFilters.school}
                  onValueChange={(v) => setHistoricalFilters((f) => ({ ...f, school: v }))}
                  placeholder="All Schools"
                  searchPlaceholder="Search schools..."
                  options={availableHistoricalSchools.map((s) => ({ value: s, label: s }))}
                />
              </div>
            )}

            {isHistoricalYear && availableHistoricalPrograms.length > 1 && (
              <div className="flex-1 min-w-[160px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Program</label>
                <SearchableSelect
                  value={historicalFilters.program}
                  onValueChange={(v) => setHistoricalFilters((f) => ({ ...f, program: v }))}
                  placeholder="All Programs"
                  searchPlaceholder="Search programs..."
                  options={availableHistoricalPrograms.map((p) => ({ value: p, label: p }))}
                />
              </div>
            )}

            {isHistoricalYear && availableHistoricalStatuses.length > 1 && (
              <div className="flex-1 min-w-[160px]">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
                <Select
                  value={historicalFilters.status}
                  onValueChange={(v) => setHistoricalFilters((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>
                    {availableHistoricalStatuses.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
        )}
      </Card>

      {isLiveYear ? (
        <RecordsList filteredData={filteredData} currentUserId={currentUserId} />
      ) : (
        <HistoricalDetailedView records={historicalFilteredRecords} />
      )}

      <ProfileCompletionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userData={userData}
      />
    </div>
  );
}
