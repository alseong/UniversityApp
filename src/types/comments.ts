export type Comment = {
  id: string;
  submission_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
};

export type Notification = {
  id: string;
  recipient_id: string;
  actor_id: string;
  comment_id: string | null;
  submission_id: string;
  type: "comment_on_submission" | "reply_to_comment" | "new_reply_in_thread" | "like_on_submission";
  is_read: boolean;
  created_at: string;
};
