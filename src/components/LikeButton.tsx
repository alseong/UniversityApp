"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/app/like-actions";
import { createClient } from "../../supabase/client";

type Props = {
  submissionId: string;
  userId: string | null;
};

export default function LikeButton({ submissionId, userId }: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const fetchLikes = async () => {
      const [{ count: likeCount }, { data: userLike }] = await Promise.all([
        supabase.from("likes").select("*", { count: "exact", head: true }).eq("submission_id", submissionId),
        userId
          ? supabase.from("likes").select("user_id").eq("submission_id", submissionId).eq("user_id", userId).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      setCount(likeCount ?? 0);
      setLiked(!!userLike);
      setLoading(false);
    };
    fetchLikes();
  }, [submissionId, userId]);

  const handleClick = async () => {
    const prevLiked = liked;
    const prevCount = count;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));

    const result = await toggleLikeAction(submissionId);
    if (result.error) {
      setLiked(prevLiked);
      setCount(prevCount);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!userId || loading}
      aria-label={liked ? "Unlike" : "Like"}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      <Heart
        className={liked ? "h-4 w-4 fill-red-500 stroke-red-500" : "h-4 w-4"}
      />
      <span>{count}</span>
    </button>
  );
}
