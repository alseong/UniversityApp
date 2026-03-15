"use server";

import { createClient } from "../../supabase/server";

export const postCommentAction = async (
  formData: FormData
): Promise<{ error?: string; success?: boolean }> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Must be signed in to comment" };

  const submissionId = formData.get("submission_id")?.toString();
  const content = formData.get("content")?.toString()?.trim();
  const parentId = formData.get("parent_id")?.toString() ?? null;

  if (!submissionId || !content) return { error: "Missing required fields" };
  if (content.length > 1000) return { error: "Comment must be 1000 characters or less" };

  if (parentId) {
    const { data: parent } = await supabase
      .from("comments")
      .select("parent_id")
      .eq("id", parentId)
      .single();
    if (parent?.parent_id !== null) return { error: "Cannot reply to a reply" };
  }

  const { error } = await supabase.from("comments").insert({
    submission_id: submissionId,
    user_id: user.id,
    parent_id: parentId,
    content,
  });

  if (error) return { error: error.message };
  return { success: true };
};
