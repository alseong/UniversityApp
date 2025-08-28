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
  grade: string;
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
      grade: "",
      type: "u",
      ibApMark: undefined,
      otherSpecialization: "",
    },
  ]);
  const [useSimpleGradeEntry, setUseSimpleGradeEntry] = useState(false);
  const [avgGrade11, setAvgGrade11] = useState("");
  const [avgGrade12, setAvgGrade12] = useState("");
  const [universityAttendance, setUniversityAttendance] = useState("");
  const [highSchool, setHighSchool] = useState("");
  const [otherAchievements, setOtherAchievements] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [universityOptions, setUniversityOptions] = useState<string[]>([]);
  const [programOptions, setProgramOptions] = useState<string[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

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

        // Handle backward compatibility for grades: convert 'specialization' to 'type'
        const grades = admissionData.grades || [];
        const normalizedGrades = grades.map((grade: any) => ({
          ...grade,
          type: grade.type || grade.specialization || "u", // Use 'type' if exists, fallback to 'specialization', default to 'u'
          specialization: undefined, // Remove old field
        }));

        // Check if there's an average grade saved (simple entry mode)
        if (admissionData.avg_grade_11 || admissionData.avg_grade_12) {
          setUseSimpleGradeEntry(true);
          setAvgGrade11(admissionData.avg_grade_11 || "");
          setAvgGrade12(admissionData.avg_grade_12 || "");
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
    setGrades([
      ...grades,
      {
        level: "grade_11",
        courseName: "",
        courseCode: "",
        grade: "",
        type: "u",
        ibApMark: undefined,
        otherSpecialization: "",
      },
    ]);
    setHasUnsavedChanges(true);
  };

  const removeGrade = (index: number) => {
    setGrades(grades.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const updateGrade = (
    index: number,
    field: keyof Grade,
    value: string | number | undefined
  ) => {
    const updated = [...grades];
    (updated[index] as any)[field] = value;
    setGrades(updated);
    setHasUnsavedChanges(true);
  };

  const validateGrades = () => {
    return grades.every((grade) => {
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
      }
    };

    // Add event listener to document to catch all link clicks
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [hasUnsavedChanges]);

  // Additional protection: Override router navigation methods
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    router.push = (href: string, options?: any) => {
      console.log("Router.push intercepted:", href);
      if (hasUnsavedChanges) {
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
      if (hasUnsavedChanges) {
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
      if (hasUnsavedChanges) {
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
      if (hasUnsavedChanges) {
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
  }, [hasUnsavedChanges, router]);

  const handleSave = async () => {
    if (!validateGrades()) {
      // Show validation error as toast
      toast({
        title: "Validation Error",
        description:
          "Please fix invalid grades before saving: IB marks must be 1-7, AP marks must be 1-5",
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
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">Your Admission Data</h1>

              {/* Top Save Button */}
              <div className="flex flex-col items-end space-y-1">
                <Button
                  onClick={() => handleSave()}
                  disabled={!validateGrades() || isSaving}
                  className={`px-6 py-2 ${!validateGrades() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>

                {/* Status indicator */}
                <div className="text-xs text-right">
                  {isSaving && <p className="text-blue-600">Saving...</p>}
                  {lastSaved && !isSaving && (
                    <p className="text-gray-500">
                      {hasUnsavedChanges
                        ? "Unsaved changes"
                        : `Last saved: ${lastSaved.toLocaleTimeString()}`}
                    </p>
                  )}
                  {!validateGrades() && (
                    <p className="text-red-600">Fix validation errors</p>
                  )}
                </div>
              </div>
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
                {universities.map((university, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
                  >
                    <div>
                      <Label htmlFor={`university-${index}`}>
                        University Name
                      </Label>
                      <AutocompleteInput
                        id={`university-${index}`}
                        placeholder="e.g., University of Toronto"
                        value={university.name}
                        onChange={(value) =>
                          updateUniversity(index, "name", value)
                        }
                        options={universityOptions}
                        emptyMessage="No universities found. You can type your own university name."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`program-${index}`}>Program</Label>
                      <AutocompleteInput
                        id={`program-${index}`}
                        placeholder="e.g., Computer Science, Engineering"
                        value={university.program}
                        onChange={(value) =>
                          updateUniversity(index, "program", value)
                        }
                        options={programOptions}
                        emptyMessage="No programs found. You can type your own program name."
                      />
                    </div>
                    <div>
                      <Label htmlFor={`status-${index}`}>
                        Application Status
                      </Label>
                      <Select
                        value={university.status}
                        onValueChange={(value) =>
                          updateUniversity(index, "status", value)
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
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="waitlisted">Waitlisted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="planning_on_applying">
                            Planning on applying
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      {universities.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeUniversity(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
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
                <CardTitle>Academic Grades</CardTitle>
                <CardDescription>
                  Enter your Grade 11 and Grade 12 grades
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
                            value={avgGrade11}
                            onChange={(e) => {
                              setAvgGrade11(e.target.value);
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
                            value={avgGrade12}
                            onChange={(e) => {
                              setAvgGrade12(e.target.value);
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
                    {grades.map((grade, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 lg:grid-cols-8 gap-4 p-4 border rounded-lg"
                      >
                        <div className="space-y-2">
                          <Label htmlFor={`grade-level-${index}`}>
                            Grade Level
                          </Label>
                          <Select
                            value={grade.level}
                            onValueChange={(value) =>
                              updateGrade(index, "level", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grade_11">Grade 11</SelectItem>
                              <SelectItem value="grade_12">Grade 12</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`course-name-${index}`}>
                            Course Name
                          </Label>
                          <Input
                            id={`course-name-${index}`}
                            placeholder="e.g., Advanced Functions"
                            value={grade.courseName}
                            onChange={(e) =>
                              updateGrade(index, "courseName", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`course-code-${index}`}>
                            Course Code
                          </Label>
                          <Input
                            id={`course-code-${index}`}
                            placeholder="e.g., MHF4U"
                            value={grade.courseCode}
                            onChange={(e) =>
                              updateGrade(index, "courseCode", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`grade-${index}`}>Grade</Label>
                          <Input
                            id={`grade-${index}`}
                            placeholder="e.g., 95%"
                            value={grade.grade}
                            onChange={(e) =>
                              updateGrade(index, "grade", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`type-${index}`}>Type</Label>
                          <Select
                            value={grade.type}
                            onValueChange={(value) =>
                              updateGrade(index, "type", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="u">U (University)</SelectItem>
                              <SelectItem value="m">M (Mixed)</SelectItem>
                              <SelectItem value="c">C (College)</SelectItem>
                              <SelectItem value="e">E (Workplace)</SelectItem>
                              <SelectItem value="o">O (Open)</SelectItem>
                              <SelectItem value="ib">IB</SelectItem>
                              <SelectItem value="ap">AP</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Conditional IB/AP Mark field */}
                        {(grade.type === "ib" || grade.type === "ap") && (
                          <div className="space-y-2">
                            <Label htmlFor={`ib-ap-${index}`}>
                              {grade.type === "ib" ? "IB Mark" : "AP Mark"}
                            </Label>
                            <Input
                              id={`ib-ap-${index}`}
                              type="number"
                              min={1}
                              max={grade.type === "ib" ? 7 : 5}
                              placeholder={grade.type === "ib" ? "1-7" : "1-5"}
                              value={grade.ibApMark || ""}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);

                                if (!e.target.value || e.target.value === "") {
                                  updateGrade(index, "ibApMark", undefined);
                                } else if (!isNaN(value)) {
                                  updateGrade(index, "ibApMark", value);
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
                            <Label htmlFor={`other-spec-${index}`}>
                              Specify Other
                            </Label>
                            <Input
                              id={`other-spec-${index}`}
                              placeholder="e.g., Honors, Cambridge, etc."
                              value={grade.otherSpecialization || ""}
                              onChange={(e) =>
                                updateGrade(
                                  index,
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

                        <div className="flex items-end">
                          {grades.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeGrade(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
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

            {/* Save Button */}
            <div className="flex flex-col items-center space-y-2">
              <Button
                onClick={() => handleSave()}
                disabled={!validateGrades() || isSaving}
                className={`px-8 py-3 text-lg ${!validateGrades() ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              {!validateGrades() && (
                <p className="text-sm text-red-600 text-center">
                  Please fix the IB/AP mark validation errors before saving.
                </p>
              )}
              {isSaving && (
                <p className="text-sm text-blue-600 text-center">Saving...</p>
              )}
              {lastSaved && !isSaving && (
                <p className="text-sm text-gray-600 text-center">
                  {hasUnsavedChanges
                    ? "Unsaved changes"
                    : `Last saved: ${lastSaved.toLocaleString()}`}
                </p>
              )}
            </div>

            <FormMessage message={searchParams} />
          </div>
        </div>
      </main>
    </>
  );
}
