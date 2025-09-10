"use client";

// Force dynamic rendering to prevent caching issues
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormMessage } from "@/components/form-message";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { useRouter, usePathname } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { getUniversityNames, getProgramNames } from "@/utils/university-data";

interface University {
  name: string;
  program: string;
  status: string;
}

interface Grade {
  level: string;
  courseName: string;
  courseCode: string;
  grade: number | null; // Only numbers now (null for empty)
  type: string;
  ibApMark?: number;
  otherSpecialization?: string;
}

export default function SubmitData({ searchParams }: { searchParams?: any }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [universities, setUniversities] = useState<University[]>([
    { name: "", program: "", status: "" },
  ]);
  const [grades, setGrades] = useState<Grade[]>([
    {
      level: "grade_11",
      courseName: "",
      courseCode: "",
      grade: null,
      type: "u",
      ibApMark: undefined,
      otherSpecialization: "",
    },
  ]);
  const [useSimpleGradeEntry, setUseSimpleGradeEntry] = useState(false);
  const [avgGrade11, setAvgGrade11] = useState<number | null>(null);
  const [avgGrade12, setAvgGrade12] = useState<number | null>(null);
  const [universityAttendance, setUniversityAttendance] = useState("");
  const [highSchool, setHighSchool] = useState("");
  const [otherAchievements, setOtherAchievements] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [navigationConfirmed, setNavigationConfirmed] = useState(false);
  const [universityOptions, setUniversityOptions] = useState<string[]>([]);
  const [programOptions, setProgramOptions] = useState<string[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showGradeLevelSelector, setShowGradeLevelSelector] = useState(false);

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

      // Load existing admission data if available
      await loadExistingData(user.id, supabase);
      setLoading(false);
    };
    checkUser();
  }, [router]);

  // Load university and program options
  useEffect(() => {
    try {
      const universities = getUniversityNames();
      const programs = getProgramNames();
      setUniversityOptions(universities);
      setProgramOptions(programs);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error loading university data:", error);
      // Still set as loaded even on error so form is usable
      setDataLoaded(true);
    }
  }, []);

  const loadExistingData = async (userId: string, supabase: any) => {
    try {
      // Try to load from the new simplified structure first
      const { data: admissionData } = await supabase
        .from("admissions_data")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (admissionData) {
        // Load data from the simplified structure
        setUniversityAttendance(admissionData.university_attendance || "");
        setHighSchool(admissionData.high_school || "");
        setOtherAchievements(admissionData.other_achievements || "");
        setUniversities(
          admissionData.universities || [{ name: "", program: "", status: "" }]
        );

        // Handle backward compatibility for grades: convert 'specialization' to 'type' and ensure grade is number
        const grades = admissionData.grades || [];
        const normalizedGrades = grades.map((grade: any) => ({
          ...grade,
          type: grade.type || grade.specialization || "u", // Use 'type' if exists, fallback to 'specialization', default to 'u'
          specialization: undefined, // Remove old field
          grade:
            grade.grade === "" || grade.grade === null
              ? null
              : Number(grade.grade), // Convert to number or null
        }));

        // Check if there's an average grade saved (simple entry mode)
        if (admissionData.avg_grade_11 || admissionData.avg_grade_12) {
          setUseSimpleGradeEntry(true);
          // Convert avg_grade_11 with backward compatibility
          const grade11 = admissionData.avg_grade_11;
          if (grade11) {
            if (typeof grade11 === "string" && grade11.includes("%")) {
              setAvgGrade11(parseFloat(grade11.replace("%", "")) || null);
            } else if (!isNaN(Number(grade11))) {
              setAvgGrade11(Number(grade11));
            } else {
              setAvgGrade11(null);
            }
          } else {
            setAvgGrade11(null);
          }

          // Convert avg_grade_12 with backward compatibility
          const grade12 = admissionData.avg_grade_12;
          if (grade12) {
            if (typeof grade12 === "string" && grade12.includes("%")) {
              setAvgGrade12(parseFloat(grade12.replace("%", "")) || null);
            } else if (!isNaN(Number(grade12))) {
              setAvgGrade12(Number(grade12));
            } else {
              setAvgGrade12(null);
            }
          } else {
            setAvgGrade12(null);
          }
        } else {
          setGrades(
            normalizedGrades.length > 0
              ? normalizedGrades
              : [
                  {
                    level: "grade_11",
                    courseName: "",
                    courseCode: "",
                    grade: "",
                    type: "u",
                    ibApMark: undefined,
                    otherSpecialization: "",
                  },
                ]
          );
        }
        setLastSaved(new Date(admissionData.updated_at));
      }
    } catch (error) {
      // If no data exists or error, keep default empty state
      console.log("No existing data found or error loading:", error);
    }
  };

  const addUniversity = () => {
    setUniversities([...universities, { name: "", program: "", status: "" }]);
    setHasUnsavedChanges(true);
  };

  const addProgramToUniversity = (index: number) => {
    const university = universities[index];
    if (!university.name) {
      toast({
        title: "University name required",
        description:
          "Please enter a university name first before adding programs.",
        variant: "destructive",
      });
      return;
    }

    // Add a new entry with the same university name
    const newUniversity = {
      name: university.name,
      program: "",
      status: "",
    };

    setUniversities([...universities, newUniversity]);
    setHasUnsavedChanges(true);
  };

  const removeUniversity = (index: number) => {
    setUniversities(universities.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const updateUniversity = (
    index: number,
    field: keyof University,
    value: string
  ) => {
    const updated = [...universities];
    updated[index][field] = value;
    setUniversities(updated);
    setHasUnsavedChanges(true);
  };

  const addGrade = () => {
    const newGrade = {
      level: "", // Start with empty level - no grouping until user selects
      courseName: "",
      courseCode: "",
      grade: null,
      type: "u",
      ibApMark: undefined,
      otherSpecialization: "",
    };

    setGrades([...grades, newGrade]);
    setHasUnsavedChanges(true);
  };

  const addGradeToGroup = (level: string) => {
    const newGrade = {
      level: level as "grade_11" | "grade_12",
      courseName: "",
      courseCode: "",
      grade: null,
      type: "u",
      ibApMark: undefined,
      otherSpecialization: "",
    };

    setGrades([...grades, newGrade]);
    setHasUnsavedChanges(true);
  };

  const removeGrade = (index: number) => {
    setGrades(grades.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const updateGrade = (
    index: number,
    field: keyof Grade,
    value: string | number | null | undefined
  ) => {
    const updated = [...grades];
    (updated[index] as any)[field] = value;
    setGrades(updated);
    setHasUnsavedChanges(true);
  };

  const validateGrades = () => {
    return grades.every((grade) => {
      // Validate main grade field (0-100 or null)
      if (
        grade.grade !== null &&
        (typeof grade.grade !== "number" ||
          grade.grade < 0 ||
          grade.grade > 100)
      ) {
        return false;
      }

      // Validate IB/AP marks if present
      if (!grade.ibApMark) return true; // Empty marks are valid

      if (grade.type === "ib") {
        return grade.ibApMark >= 1 && grade.ibApMark <= 7;
      } else if (grade.type === "ap") {
        return grade.ibApMark >= 1 && grade.ibApMark <= 5;
      }

      return true;
    });
  };

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Intercept navigation attempts via Link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      console.log("Link click detected:", e.target); // Debug log

      if (!hasUnsavedChanges) {
        console.log("No unsaved changes, allowing navigation");
        return;
      }

      const target = e.target as HTMLElement;

      // Check if clicked element or its parent is a link
      const link = target.closest("a[href]") as HTMLAnchorElement;
      if (!link) {
        console.log("No link found");
        return;
      }

      const href = link.getAttribute("href");
      console.log("Link href:", href);

      if (!href) return;

      // Only intercept internal links (not external URLs)
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        console.log("External link, not intercepting");
        return;
      }

      // Don't intercept if it's the same page
      if (href === window.location.pathname) {
        console.log("Same page, not intercepting");
        return;
      }

      console.log("Intercepting navigation to:", href);

      // Show confirmation dialog
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );

      if (!confirmed) {
        console.log("Navigation cancelled by user");
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      } else {
        console.log("Navigation confirmed by user");
        // Set flag to prevent double confirmation from router override
        setNavigationConfirmed(true);
        // Reset flag after navigation completes
        setTimeout(() => setNavigationConfirmed(false), 100);
      }
    };

    // Add event listener to document to catch all link clicks
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [hasUnsavedChanges, setNavigationConfirmed]);

  // Additional protection: Override router navigation methods
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    router.push = (href: string, options?: any) => {
      console.log("Router.push intercepted:", href);
      if (hasUnsavedChanges && !navigationConfirmed) {
        const confirmed = window.confirm(
          "You have unsaved changes. Are you sure you want to leave this page?"
        );
        if (!confirmed) {
          console.log("Router navigation cancelled");
          return Promise.resolve(false);
        }
      }
      return originalPush.call(router, href, options);
    };

    router.replace = (href: string, options?: any) => {
      console.log("Router.replace intercepted:", href);
      if (hasUnsavedChanges && !navigationConfirmed) {
        const confirmed = window.confirm(
          "You have unsaved changes. Are you sure you want to leave this page?"
        );
        if (!confirmed) {
          console.log("Router replace cancelled");
          return Promise.resolve(false);
        }
      }
      return originalReplace.call(router, href, options);
    };

    router.back = () => {
      console.log("Router.back intercepted");
      if (hasUnsavedChanges && !navigationConfirmed) {
        const confirmed = window.confirm(
          "You have unsaved changes. Are you sure you want to leave this page?"
        );
        if (!confirmed) {
          console.log("Router back cancelled");
          return;
        }
      }
      originalBack.call(router);
    };

    router.forward = () => {
      console.log("Router.forward intercepted");
      if (hasUnsavedChanges && !navigationConfirmed) {
        const confirmed = window.confirm(
          "You have unsaved changes. Are you sure you want to leave this page?"
        );
        if (!confirmed) {
          console.log("Router forward cancelled");
          return;
        }
      }
      originalForward.call(router);
    };

    return () => {
      // Restore original methods
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [hasUnsavedChanges, navigationConfirmed, router]);

  const handleSave = async () => {
    if (!validateGrades()) {
      // Show validation error as toast
      toast({
        title: "Validation Error",
        description:
          "Please fix invalid grades before saving: Grades must be 0-100, IB marks must be 1-7, AP marks must be 1-5",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();
      const saveData = {
        user_id: user.id,
        university_attendance: universityAttendance,
        high_school: highSchool,
        other_achievements: otherAchievements,
        universities: universities,
        grades: useSimpleGradeEntry ? [] : grades,
        avg_grade_11: useSimpleGradeEntry ? avgGrade11 : null,
        avg_grade_12: useSimpleGradeEntry ? avgGrade12 : null,
      };

      // Try to update existing data first, if it doesn't exist, insert new
      const { data: existingData } = await supabase
        .from("admissions_data")
        .select("id")
        .eq("user_id", user.id)
        .single();

      let result;
      if (existingData) {
        // Update existing data
        result = await supabase
          .from("admissions_data")
          .update({
            ...saveData,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
      } else {
        // Insert new data
        result = await supabase.from("admissions_data").insert(saveData);
      }

      if (result.error) {
        throw result.error;
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setNavigationConfirmed(false); // Reset navigation flag when data is saved

      // Show success toast
      toast({
        title: "Success!",
        description: "Your admission data has been saved successfully.",
      });
    } catch (error) {
      console.error("Save error:", error);

      // Show error toast
      toast({
        title: "Save Error",
        description: "Failed to save your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
        <div className="container mx-auto px-4 py-8 pb-32">
          {/* Header Section */}
          <header className="mb-8">
            <div className="mb-4">
              <h1 className="text-3xl font-bold">Your Admission Data</h1>
            </div>
          </header>

          <div className="space-y-8">
            {/* University Attendance */}
            <Card>
              <CardHeader>
                <CardTitle>University Attendance</CardTitle>
                <CardDescription>
                  When did you start university, or when do you plan to start?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={universityAttendance}
                  onValueChange={(value) => {
                    setUniversityAttendance(value);
                    setHasUnsavedChanges(true);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2027_onwards">2027 onwards</SelectItem>
                    <SelectItem value="fall_2026">Fall 2026</SelectItem>
                    <SelectItem value="spring_2026">Spring 2026</SelectItem>
                    <SelectItem value="winter_2026">Winter 2026</SelectItem>
                    <SelectItem value="fall_2025">Fall 2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="before_2020">Before 2020</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* High School */}
            <Card>
              <CardHeader>
                <CardTitle>High School</CardTitle>
                <CardDescription>
                  Which high school did/do you attend?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="high-school">High School Name</Label>
                  <Input
                    id="high-school"
                    placeholder="e.g., Bayview Secondary School"
                    value={highSchool}
                    onChange={(e) => {
                      setHighSchool(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* University Applications */}
            <Card>
              <CardHeader>
                <CardTitle>University Applications</CardTitle>
                <CardDescription>
                  Which universities did you apply to and what was the outcome?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  // Group universities by name
                  const groupedUniversities = universities.reduce(
                    (groups, university, index) => {
                      if (!university.name) {
                        // Universities without names get their own group
                        groups.push([{ ...university, index }]);
                      } else {
                        const existingGroup = groups.find(
                          (group) => group[0].name === university.name
                        );
                        if (existingGroup) {
                          existingGroup.push({ ...university, index });
                        } else {
                          groups.push([{ ...university, index }]);
                        }
                      }
                      return groups;
                    },
                    [] as Array<Array<University & { index: number }>>
                  );

                  return groupedUniversities.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-3">
                      {group.map((university, groupItemIndex) => {
                        const isFirstInGroup = groupItemIndex === 0;
                        const isPartOfGroup = group.length > 1;

                        return (
                          <div
                            key={university.index}
                            className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg ${
                              isPartOfGroup && !isFirstInGroup
                                ? "ml-6 border-l-4 border-l-blue-200 bg-blue-50/30"
                                : ""
                            }`}
                          >
                            {isFirstInGroup ? (
                              <div>
                                <Label
                                  htmlFor={`university-${university.index}`}
                                >
                                  University Name
                                </Label>
                                <AutocompleteInput
                                  id={`university-${university.index}`}
                                  placeholder="e.g., University of Toronto"
                                  value={university.name}
                                  onChange={(value) =>
                                    updateUniversity(
                                      university.index,
                                      "name",
                                      value
                                    )
                                  }
                                  options={universityOptions}
                                  emptyMessage="No universities found. You can type your own university name."
                                />
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <div className="text-sm text-gray-500 font-medium">
                                  {university.name}
                                </div>
                              </div>
                            )}
                            <div>
                              <Label htmlFor={`program-${university.index}`}>
                                Program
                              </Label>
                              <AutocompleteInput
                                id={`program-${university.index}`}
                                placeholder="e.g., Computer Science, Engineering"
                                value={university.program}
                                onChange={(value) =>
                                  updateUniversity(
                                    university.index,
                                    "program",
                                    value
                                  )
                                }
                                options={programOptions}
                                emptyMessage="No programs found. You can type your own program name."
                              />
                            </div>
                            <div>
                              <Label htmlFor={`status-${university.index}`}>
                                Application Status
                              </Label>
                              <Select
                                value={university.status}
                                onValueChange={(value) =>
                                  updateUniversity(
                                    university.index,
                                    "status",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="received_offer_and_accepted">
                                    Received Offer and Accepted
                                  </SelectItem>
                                  <SelectItem value="received_offer_and_rejected">
                                    Received Offer and Rejected
                                  </SelectItem>
                                  <SelectItem value="accepted">
                                    Accepted
                                  </SelectItem>
                                  <SelectItem value="waitlisted">
                                    Waitlisted
                                  </SelectItem>
                                  <SelectItem value="deferred">
                                    Deferred
                                  </SelectItem>
                                  <SelectItem value="rejected">
                                    Rejected
                                  </SelectItem>
                                  <SelectItem value="applied">
                                    Applied
                                  </SelectItem>
                                  <SelectItem value="planning_on_applying">
                                    Planning on applying
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  addProgramToUniversity(university.index)
                                }
                                disabled={!university.name}
                                className="text-blue-600 hover:text-blue-700"
                                title="Add another program to this university"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              {universities.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    removeUniversity(university.index)
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addUniversity}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add University
                </Button>
              </CardContent>
            </Card>

            {/* Grades */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Grades (so far)</CardTitle>
                <CardDescription>
                  Enter your Grade 11 and Grade 12 grades (non-final grades are
                  okay)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Toggle for simple/detailed entry */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="simple-grade-entry"
                    checked={useSimpleGradeEntry}
                    onCheckedChange={(checked) => {
                      setUseSimpleGradeEntry(checked);
                      setHasUnsavedChanges(true);
                    }}
                  />
                  <Label htmlFor="simple-grade-entry">
                    Just include the average grade
                  </Label>
                </div>

                {useSimpleGradeEntry ? (
                  // Simple average grade entry
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="avg-grade-11">
                          Average Grade 11 Grade
                        </Label>
                        <div className="relative">
                          <Input
                            id="avg-grade-11"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="85"
                            value={avgGrade11 || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setAvgGrade11(
                                value === "" ? null : Number(value)
                              );
                              setHasUnsavedChanges(true);
                            }}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            %
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="avg-grade-12">
                          Average Grade 12 Grade
                        </Label>
                        <div className="relative">
                          <Input
                            id="avg-grade-12"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="87"
                            value={avgGrade12 || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setAvgGrade12(
                                value === "" ? null : Number(value)
                              );
                              setHasUnsavedChanges(true);
                            }}
                            className="pr-8"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Detailed grade entry
                  <div className="space-y-4">
                    {(() => {
                      // Group grades by level
                      const groupedGrades = grades.reduce(
                        (groups, grade, index) => {
                          // Only group grades that have a level selected
                          if (!grade.level || grade.level.trim() === "") {
                            // Standalone grade - add to its own group
                            groups.push([{ ...grade, index }]);
                          } else {
                            const existingGroup = groups.find(
                              (group) => group[0].level === grade.level
                            );
                            if (existingGroup) {
                              existingGroup.push({ ...grade, index });
                            } else {
                              groups.push([{ ...grade, index }]);
                            }
                          }
                          return groups;
                        },
                        [] as Array<Array<Grade & { index: number }>>
                      );

                      return groupedGrades.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-3">
                          {group.map((grade, groupItemIndex) => {
                            const isFirstInGroup = groupItemIndex === 0;
                            const isPartOfGroup = group.length > 1;

                            return (
                              <div
                                key={grade.index}
                                className={`grid grid-cols-1 lg:grid-cols-8 gap-4 p-4 border rounded-lg ${
                                  isPartOfGroup && !isFirstInGroup
                                    ? "ml-6 border-l-4 border-l-blue-200 bg-blue-50/30"
                                    : ""
                                }`}
                              >
                                {isFirstInGroup ? (
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`grade-level-${grade.index}`}
                                    >
                                      Grade Level
                                    </Label>
                                    <Select
                                      value={grade.level}
                                      onValueChange={(value) =>
                                        updateGrade(grade.index, "level", value)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select grade" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="grade_11">
                                          Grade 11
                                        </SelectItem>
                                        <SelectItem value="grade_12">
                                          Grade 12
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <div className="text-sm text-gray-500 font-medium">
                                      {grade.level === "grade_11"
                                        ? "Grade 11"
                                        : "Grade 12"}
                                    </div>
                                  </div>
                                )}
                                <div className="space-y-2">
                                  <Label htmlFor={`course-name-${grade.index}`}>
                                    Course Name
                                  </Label>
                                  <Input
                                    id={`course-name-${grade.index}`}
                                    placeholder="e.g., Advanced Functions"
                                    value={grade.courseName}
                                    onChange={(e) =>
                                      updateGrade(
                                        grade.index,
                                        "courseName",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`course-code-${grade.index}`}>
                                    Course Code
                                  </Label>
                                  <Input
                                    id={`course-code-${grade.index}`}
                                    placeholder="e.g., MHF4U"
                                    value={grade.courseCode}
                                    onChange={(e) =>
                                      updateGrade(
                                        grade.index,
                                        "courseCode",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`type-${grade.index}`}>
                                    Type (ex. U, IB, AP)
                                  </Label>
                                  <Select
                                    value={grade.type}
                                    onValueChange={(value) =>
                                      updateGrade(grade.index, "type", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="u">
                                        U (University)
                                      </SelectItem>
                                      <SelectItem value="m">
                                        M (Mixed)
                                      </SelectItem>
                                      <SelectItem value="c">
                                        C (College)
                                      </SelectItem>
                                      <SelectItem value="e">
                                        E (Workplace)
                                      </SelectItem>
                                      <SelectItem value="o">
                                        O (Open)
                                      </SelectItem>
                                      <SelectItem value="ib">IB</SelectItem>
                                      <SelectItem value="ap">AP</SelectItem>
                                      <SelectItem value="other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`grade-${grade.index}`}>
                                    Grade
                                  </Label>
                                  <div className="relative">
                                    <Input
                                      id={`grade-${grade.index}`}
                                      type="number"
                                      min="0"
                                      max="100"
                                      placeholder="95"
                                      value={grade.grade || ""}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow empty string or valid number
                                        if (
                                          value === "" ||
                                          (!isNaN(Number(value)) &&
                                            Number(value) >= 0 &&
                                            Number(value) <= 100)
                                        ) {
                                          updateGrade(
                                            grade.index,
                                            "grade",
                                            value === "" ? null : Number(value)
                                          );
                                        }
                                      }}
                                      className={`pr-8 ${
                                        grade.grade !== null &&
                                        (typeof grade.grade !== "number" ||
                                          grade.grade < 0 ||
                                          grade.grade > 100)
                                          ? "border-red-500 focus:border-red-500"
                                          : ""
                                      }`}
                                    />
                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                      %
                                    </span>
                                  </div>
                                  {grade.grade !== null &&
                                    (typeof grade.grade !== "number" ||
                                      grade.grade < 0 ||
                                      grade.grade > 100) && (
                                      <p className="text-sm text-red-600 mt-1">
                                        Grade must be between 0-100
                                      </p>
                                    )}
                                </div>

                                {/* Conditional IB/AP Mark field */}
                                {(grade.type === "ib" ||
                                  grade.type === "ap") && (
                                  <div className="space-y-2">
                                    <Label htmlFor={`ib-ap-${grade.index}`}>
                                      {grade.type === "ib"
                                        ? "IB Mark"
                                        : "AP Mark"}
                                    </Label>
                                    <Input
                                      id={`ib-ap-${grade.index}`}
                                      type="number"
                                      min={1}
                                      max={grade.type === "ib" ? 7 : 5}
                                      placeholder={
                                        grade.type === "ib" ? "1-7" : "1-5"
                                      }
                                      value={grade.ibApMark || ""}
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value);

                                        if (
                                          !e.target.value ||
                                          e.target.value === ""
                                        ) {
                                          updateGrade(
                                            grade.index,
                                            "ibApMark",
                                            undefined
                                          );
                                        } else if (!isNaN(value)) {
                                          updateGrade(
                                            grade.index,
                                            "ibApMark",
                                            value
                                          );
                                        }
                                      }}
                                      className={
                                        grade.ibApMark &&
                                        (grade.ibApMark < 1 ||
                                          grade.ibApMark >
                                            (grade.type === "ib" ? 7 : 5))
                                          ? "border-red-500 focus:border-red-500"
                                          : ""
                                      }
                                    />
                                    {grade.ibApMark &&
                                      (grade.ibApMark < 1 ||
                                        grade.ibApMark >
                                          (grade.type === "ib" ? 7 : 5)) && (
                                        <p className="text-sm text-red-600 mt-1">
                                          {grade.type === "ib"
                                            ? "IB marks must be between 1-7"
                                            : "AP marks must be between 1-5"}
                                        </p>
                                      )}
                                  </div>
                                )}

                                {/* Conditional Other type field */}
                                {grade.type === "other" && (
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`other-spec-${grade.index}`}
                                    >
                                      Specify Other
                                    </Label>
                                    <Input
                                      id={`other-spec-${grade.index}`}
                                      placeholder="e.g., Honors, Cambridge, etc."
                                      value={grade.otherSpecialization || ""}
                                      onChange={(e) =>
                                        updateGrade(
                                          grade.index,
                                          "otherSpecialization",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                )}

                                {/* Spacer column for alignment when no conditional fields */}
                                {(grade.type === "u" ||
                                  grade.type === "m" ||
                                  grade.type === "c" ||
                                  grade.type === "e" ||
                                  grade.type === "o") && <div></div>}

                                <div className="flex items-end gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addGradeToGroup(grade.level)}
                                    className="text-blue-600 hover:text-blue-700"
                                    title="Add another course to this grade level"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                  {grades.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeGrade(grade.index)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ));
                    })()}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addGrade}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Grade
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Other Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Other Achievements</CardTitle>
                <CardDescription>
                  Share any additional achievements, awards, extracurricular
                  activities, work experience, or other accomplishments that may
                  be relevant to your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="other-achievements">
                    Achievements & Activities
                  </Label>
                  <Textarea
                    id="other-achievements"
                    placeholder="e.g., Academic awards, leadership roles, volunteer work, part-time jobs, sports achievements, competitions, certifications, published work, etc."
                    value={otherAchievements}
                    onChange={(e) => {
                      setOtherAchievements(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    Optional: Include any achievements that help showcase your
                    profile beyond grades and university applications
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button - Sticky at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    onClick={() => handleSave()}
                    disabled={isSaving}
                    className="px-8 py-3 text-lg w-full max-w-md"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  {!validateGrades() && (
                    <p className="text-sm text-red-600 text-center">
                      Please fix the grade validation errors before saving.
                      Grades must be 0-100, IB marks must be 1-7, AP marks must
                      be 1-5.
                    </p>
                  )}
                  {isSaving && (
                    <p className="text-sm text-blue-600 text-center">
                      Saving...
                    </p>
                  )}
                  {hasUnsavedChanges && !isSaving && (
                    <p className="text-sm text-gray-600 text-center">
                      Unsaved changes
                    </p>
                  )}
                </div>
              </div>
            </div>

            <FormMessage message={searchParams} />
          </div>
        </div>
      </main>
    </>
  );
}
