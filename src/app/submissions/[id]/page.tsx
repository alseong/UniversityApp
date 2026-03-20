import { notFound, redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { formatAttendanceYear } from "@/utils/formatAttendanceYear";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, BookOpen, TrendingUp, Award, School, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CommentSection } from "@/components/comments/CommentSection";
import LikeButton from "@/components/LikeButton";

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

const calculateAverageGrade = (grades: { level: string; grade: string | null }[], level: string) => {
  const levelGrades = grades.filter((g) => g.level === level && g.grade !== null && g.grade !== "");
  if (!levelGrades.length) return null;
  return Math.round((levelGrades.reduce((acc, g) => acc + Number(g.grade), 0) / levelGrades.length) * 10) / 10;
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SubmissionPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: record } = await supabase
    .from("admissions_data")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!record) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");


  const avgGrade11 = record.avg_grade_11
    ? Number(record.avg_grade_11)
    : calculateAverageGrade(record.grades || [], "grade_11");
  const avgGrade12 = record.avg_grade_12
    ? Number(record.avg_grade_12)
    : calculateAverageGrade(record.grades || [], "grade_12");
  const grade11Courses = (record.grades || []).filter(
    (g: { level: string; grade: string | null }) => g.level === "grade_11" && g.grade !== null && g.grade !== ""
  );
  const grade12Courses = (record.grades || []).filter(
    (g: { level: string; grade: string | null }) => g.level === "grade_12" && g.grade !== null && g.grade !== ""
  );

  return (
    <main className="w-full bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href="/dashboard?view=detailed"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">
                  {formatAttendanceYear(record.university_attendance || "") || "University Student"}
                </CardTitle>
              </div>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                User: {record.user_id?.slice(-6) || "Unknown"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {record.high_school && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <School className="h-4 w-4 text-indigo-600" />
                  <h4 className="font-semibold text-sm">High School</h4>
                </div>
                <p className="text-sm text-muted-foreground">{record.high_school}</p>
              </div>
            )}

            {record.universities?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-sm">Universities & Programs</h4>
                </div>
                <div className="space-y-2">
                  {record.universities.map((uni: { name: string; program: string; status: string }, idx: number) => (
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
                    {grade11Courses.map((c: { courseName: string; courseCode: string; grade: string }, idx: number) => (
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
                    {grade12Courses.map((c: { courseName: string; courseCode: string; grade: string }, idx: number) => (
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
                  {record.other_achievements || "No achievements listed"}
                </p>
              </div>
            </div>

            <CommentSection
              submissionId={record.id}
              currentUserId={user?.id ?? null}
              defaultOpen
              leading={<LikeButton submissionId={record.id} userId={user.id} />}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
