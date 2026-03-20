"use server";

import { createClient } from "../../supabase/server";

export const toggleLikeAction = async (
  submissionId: string
): Promise<{ liked: boolean; error?: string }> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { liked: false, error: "Must be signed in to like" };

  const { data: existing } = await supabase
    .from("likes")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("submission_id", submissionId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("submission_id", submissionId);
    return { liked: false };
  }

  await supabase.from("likes").insert({ user_id: user.id, submission_id: submissionId });
  return { liked: true };
};
