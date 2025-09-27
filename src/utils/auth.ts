import { createClient } from "../../supabase/client";

export interface UserData {
  universities: Array<{ name: string; program: string; status: string }>;
  grades: Array<any>;
  avg_grade_11?: string;
  avg_grade_12?: string;
}

export const checkUserHasSufficientData = async (userId: string): Promise<{
  hasSufficientData: boolean;
  userData: UserData | null;
}> => {
  try {
    const supabase = createClient();
    const { data: admissionData } = await supabase
      .from("admissions_data")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!admissionData) {
      return { hasSufficientData: false, userData: null };
    }

    // Check if user has sufficient data
    const hasUniversities =
      admissionData.universities &&
      admissionData.universities.length > 0 &&
      admissionData.universities.some(
        (u: any) => u.name && u.name.trim() !== ""
      );

    // Check for grades - either 6+ individual grades OR at least one average grade
    const hasIndividualGrades =
      admissionData.grades && admissionData.grades.length >= 6;
    const hasAverageGrades =
      (admissionData.avg_grade_11 &&
        admissionData.avg_grade_11.trim() !== "") ||
      (admissionData.avg_grade_12 &&
        admissionData.avg_grade_12.trim() !== "");

    const hasGrades = hasIndividualGrades || hasAverageGrades;

    return {
      hasSufficientData: hasUniversities && hasGrades,
      userData: admissionData,
    };
  } catch (error) {
    console.error("Error checking user data:", error);
    return { hasSufficientData: false, userData: null };
  }
};
