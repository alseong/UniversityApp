import { AdmissionRecord } from "@/types/dashboard";
import { normalizeSupabaseStatus, extractAttendingYear } from "./supabaseNormalize";

export const transformSupabaseToAdmissionRecords = (
  supabaseData: any[]
): AdmissionRecord[] => {
  const records: AdmissionRecord[] = [];

  supabaseData.forEach((data) => {
    if (!data.universities || data.universities.length === 0) return;

    let average: number | null = null;
    if (data.avg_grade_12) {
      average = Number(data.avg_grade_12);
    } else if (data.avg_grade_11) {
      average = Number(data.avg_grade_11);
    } else if (data.grades?.length > 0) {
      const grade12 = data.grades.filter(
        (g: any) => g.level === "grade_12" && g.grade !== null && g.grade !== ""
      );
      if (grade12.length > 0) {
        average = grade12.reduce((acc: number, g: any) => acc + Number(g.grade), 0) / grade12.length;
      } else {
        const grade11 = data.grades.filter(
          (g: any) => g.level === "grade_11" && g.grade !== null && g.grade !== ""
        );
        if (grade11.length > 0) {
          average = grade11.reduce((acc: number, g: any) => acc + Number(g.grade), 0) / grade11.length;
        }
      }
    }

    data.universities.forEach((uni: any) => {
      if (uni.name?.trim() && uni.program?.trim()) {
        records.push({
          School: [uni.name],
          Program: [uni.program],
          Status: normalizeSupabaseStatus(uni.status || "pending"),
          Average: average,
          "Date Accepted": "",
          "Type (101/105)": "",
          Discord: "",
          Other: "",
          "Attending Year": extractAttendingYear(data.university_attendance || ""),
        });
      }
    });
  });

  return records;
};
