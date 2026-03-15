import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "../../supabase/client";
import { Comment, Notification } from "@/types/comments";

export function useComments(submissionId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("comments")
      .select("*")
      .eq("submission_id", submissionId)
      .order("created_at", { ascending: true });
    if (err) {
      setError(err.message);
    } else {
      setComments((data as Comment[]) ?? []);
    }
    setLoading(false);
  }, [submissionId]);

  return { comments, loading, error, fetchComments };
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      const rows = (data as Notification[]) ?? [];
      setNotifications(rows);
      setUnreadCount(rows.filter((n) => !n.is_read).length);
    };

    fetchNotifications();

    channelRef.current = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId]);

  const markRead = useCallback(async (notificationId: string) => {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  return { notifications, unreadCount, markRead };
}
