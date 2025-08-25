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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormMessage } from "@/components/form-message";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";

interface University {
  name: string;
  status: string;
}

interface Grade {
  level: string;
  courseName: string;
  courseCode: string;
  grade: string;
  specialization: string;
  ibApMark?: number;
  otherSpecialization?: string;
}

export default function SubmitData({ searchParams }: { searchParams?: any }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [universities, setUniversities] = useState<University[]>([
    { name: "", status: "" },
  ]);
  const [grades, setGrades] = useState<Grade[]>([
    {
      level: "grade_11",
      courseName: "",
      courseCode: "",
      grade: "",
      specialization: "na",
      ibApMark: undefined,
      otherSpecialization: "",
    },
  ]);
  const [universityAttendance, setUniversityAttendance] = useState("");
  const [highSchool, setHighSchool] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
        setUniversities(
          admissionData.universities || [{ name: "", status: "" }]
        );
        setGrades(
          admissionData.grades || [
            {
              level: "grade_11",
              courseName: "",
              courseCode: "",
              grade: "",
              specialization: "na",
              ibApMark: undefined,
              otherSpecialization: "",
            },
          ]
        );
        setLastSaved(new Date(admissionData.updated_at));
      }
    } catch (error) {
      // If no data exists or error, keep default empty state
      console.log("No existing data found or error loading:", error);
    }
  };

  const addUniversity = () => {
    setUniversities([...universities, { name: "", status: "" }]);
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
        specialization: "na",
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

      if (grade.specialization === "ib") {
        return grade.ibApMark >= 1 && grade.ibApMark <= 7;
      } else if (grade.specialization === "ap") {
        return grade.ibApMark >= 1 && grade.ibApMark <= 5;
      }

      return true;
    });
  };

  // Auto-save functionality
  useEffect(() => {
    if (!user || !hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(() => {
      handleSave(true); // Pass true for silent auto-save
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [
    universities,
    grades,
    universityAttendance,
    highSchool,
    hasUnsavedChanges,
  ]);

  const handleSave = async (isAutoSave = false) => {
    if (!validateGrades()) {
      if (!isAutoSave) {
        alert(
          "Please ensure all IB marks are between 1-7 and AP marks are between 1-5 before saving."
        );
      }
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();
      const saveData = {
        user_id: user.id,
        university_attendance: universityAttendance,
        high_school: highSchool,
        universities: universities,
        grades: grades,
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

      if (!isAutoSave) {
        alert("Data saved successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
      if (!isAutoSave) {
        alert("Failed to save data. Please try again.");
      }
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
                  onClick={() => handleSave(false)}
                  disabled={!validateGrades() || isSaving}
                  className={`px-6 py-2 ${!validateGrades() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>

                {/* Status indicator */}
                <div className="text-xs text-right">
                  {isSaving && <p className="text-blue-600">Auto-saving...</p>}
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
                  When will you attend university?
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
                    <SelectValue placeholder="Select attendance period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall_2025">Fall 2025</SelectItem>
                    <SelectItem value="winter_2026">Winter 2026</SelectItem>
                    <SelectItem value="spring_2026">Spring 2026</SelectItem>
                    <SelectItem value="fall_2026">Fall 2026</SelectItem>
                    <SelectItem value="2027_onwards">2027 onwards</SelectItem>
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
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
                  >
                    <div>
                      <Label htmlFor={`university-${index}`}>
                        University Name
                      </Label>
                      <Input
                        id={`university-${index}`}
                        placeholder="e.g., University of Toronto"
                        value={university.name}
                        onChange={(e) =>
                          updateUniversity(index, "name", e.target.value)
                        }
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
                  Enter your Grade 11 and Grade 12 final grades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      <Label htmlFor={`specialization-${index}`}>
                        Specialization
                      </Label>
                      <Select
                        value={grade.specialization}
                        onValueChange={(value) =>
                          updateGrade(index, "specialization", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="na">N/A</SelectItem>
                          <SelectItem value="ib">IB</SelectItem>
                          <SelectItem value="ap">AP</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Conditional IB/AP Mark field */}
                    {(grade.specialization === "ib" ||
                      grade.specialization === "ap") && (
                      <div className="space-y-2">
                        <Label htmlFor={`ib-ap-${index}`}>
                          {grade.specialization === "ib"
                            ? "IB Mark"
                            : "AP Mark"}
                        </Label>
                        <Input
                          id={`ib-ap-${index}`}
                          type="number"
                          min={1}
                          max={grade.specialization === "ib" ? 7 : 5}
                          placeholder={
                            grade.specialization === "ib" ? "1-7" : "1-5"
                          }
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
                                (grade.specialization === "ib" ? 7 : 5))
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }
                        />
                        {grade.ibApMark &&
                          (grade.ibApMark < 1 ||
                            grade.ibApMark >
                              (grade.specialization === "ib" ? 7 : 5)) && (
                            <p className="text-sm text-red-600 mt-1">
                              {grade.specialization === "ib"
                                ? "IB marks must be between 1-7"
                                : "AP marks must be between 1-5"}
                            </p>
                          )}
                      </div>
                    )}

                    {/* Conditional Other specialization field */}
                    {grade.specialization === "other" && (
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
                    {grade.specialization === "na" && <div></div>}

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
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex flex-col items-center space-y-2">
              <Button
                onClick={() => handleSave(false)}
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
                <p className="text-sm text-blue-600 text-center">
                  Auto-saving...
                </p>
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
