"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
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
import { Textarea } from "@/components/ui/textarea";
import { submitAdmissionDataAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Plus, Trash2, InfoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";

interface University {
  name: string;
  status: string;
}

interface Grade {
  level: string;
  courseName: string;
  courseCode: string;
  grade: string;
  ibApMark?: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [universities, setUniversities] = useState<University[]>([
    { name: "", status: "" },
  ]);
  const [grades, setGrades] = useState<Grade[]>([
    {
      level: "grade_11",
      courseName: "",
      courseCode: "",
      grade: "",
      ibApMark: undefined,
    },
  ]);
  const [specializedProgram, setSpecializedProgram] = useState("");
  const [universityAttendance, setUniversityAttendance] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  const addUniversity = () => {
    setUniversities([...universities, { name: "", status: "" }]);
  };

  const removeUniversity = (index: number) => {
    setUniversities(universities.filter((_, i) => i !== index));
  };

  const updateUniversity = (
    index: number,
    field: keyof University,
    value: string,
  ) => {
    const updated = [...universities];
    updated[index][field] = value;
    setUniversities(updated);
  };

  const addGrade = () => {
    setGrades([
      ...grades,
      {
        level: "grade_11",
        courseName: "",
        courseCode: "",
        grade: "",
        ibApMark: undefined,
      },
    ]);
  };

  const removeGrade = (index: number) => {
    setGrades(grades.filter((_, i) => i !== index));
  };

  const updateGrade = (
    index: number,
    field: keyof Grade,
    value: string | number,
  ) => {
    const updated = [...grades];
    updated[index][field] = value as any;
    setGrades(updated);
  };

  const handleSubmit = async (formData: FormData) => {
    formData.append("universities", JSON.stringify(universities));
    formData.append("grades", JSON.stringify(grades));
    formData.append("specialized_program", specializedProgram);
    formData.append("university_attendance", universityAttendance);

    await submitAdmissionDataAction(formData);
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
            <h1 className="text-3xl font-bold mb-4">
              Submit Your Admission Data
            </h1>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <InfoIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Join Our Waitlist
                  </h3>
                  <p className="text-blue-800 text-sm">
                    Help us build the most comprehensive university admissions
                    database. Your data will be aggregated anonymously to help
                    future students make informed decisions. We'll launch once
                    we have enough data to provide meaningful insights.
                  </p>
                </div>
              </div>
            </div>
            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <InfoIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">
                      Anonymous Submission
                    </h3>
                    <p className="text-yellow-800 text-sm">
                      You're submitting anonymously. Consider{" "}
                      <a href="/sign-in" className="underline font-medium">
                        signing in
                      </a>{" "}
                      to save your data for future use and access additional
                      features.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </header>

          <form action={handleSubmit} className="space-y-8">
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
                  onValueChange={setUniversityAttendance}
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

            {/* Specialized Program */}
            <Card>
              <CardHeader>
                <CardTitle>Specialized Program</CardTitle>
                <CardDescription>
                  Did you participate in any specialized programs?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={specializedProgram}
                  onValueChange={setSpecializedProgram}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ib">
                      International Baccalaureate (IB)
                    </SelectItem>
                    <SelectItem value="ap">Advanced Placement (AP)</SelectItem>
                    <SelectItem value="other">
                      Other specialized program
                    </SelectItem>
                    <SelectItem value="na">
                      N/A - No specialized program
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                          <SelectItem value="pending">Pending</SelectItem>
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
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg"
                  >
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
                      <Label htmlFor={`ib-ap-mark-${index}`}>IB/AP Mark</Label>
                      <Input
                        id={`ib-ap-mark-${index}`}
                        type="number"
                        placeholder="7 or 5"
                        value={grade.ibApMark || ""}
                        onChange={(e) =>
                          updateGrade(
                            index,
                            "ibApMark",
                            parseInt(e.target.value) || undefined,
                          )
                        }
                      />
                    </div>
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

            {/* Submit Button */}
            <div className="flex justify-center">
              <SubmitButton
                className="px-8 py-3 text-lg"
                pendingText="Submitting..."
              >
                Submit Admission Data
              </SubmitButton>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
