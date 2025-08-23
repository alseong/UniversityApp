"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        user_id: user.id,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        console.error("Error updating user profile:", updateError);
      }
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const signInWithGoogleAction = async () => {
  const supabase = await createClient();
  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?redirect_to=/dashboard`,
    },
  });

  if (error) {
    console.error("Google sign-in error:", error);
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if (data?.url) {
    return redirect(data.url);
  }

  return encodedRedirect(
    "error",
    "/sign-in",
    "Failed to initiate Google sign-in",
  );
};

export const submitAdmissionDataAction = async (formData: FormData) => {
  const supabase = await createClient();

  // Get user (optional for anonymous submissions)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const universityAttendance = formData
    .get("university_attendance")
    ?.toString();
  const specializedProgram = formData.get("specialized_program")?.toString();

  // Create admission submission
  const { data: submission, error: submissionError } = await supabase
    .from("admission_submissions")
    .insert({
      user_id: user?.id || null,
      university_attendance: universityAttendance,
      specialized_program: specializedProgram,
    })
    .select()
    .single();

  if (submissionError) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Failed to submit admission data",
    );
  }

  // Process university applications
  const universities = JSON.parse(
    formData.get("universities")?.toString() || "[]",
  );
  for (const uni of universities) {
    await supabase.from("university_applications").insert({
      submission_id: submission.id,
      university_name: uni.name,
      status: uni.status,
    });
  }

  // Process grades
  const grades = JSON.parse(formData.get("grades")?.toString() || "[]");
  for (const grade of grades) {
    await supabase.from("grades").insert({
      submission_id: submission.id,
      grade_level: grade.level,
      course_name: grade.courseName,
      course_code: grade.courseCode,
      grade: grade.grade,
      ib_ap_mark: grade.ibApMark || null,
    });
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Admission data submitted successfully!",
  );
};
