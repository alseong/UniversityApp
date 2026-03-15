import { Comment } from "@/types/comments";

export const formatShortId = (userId: string): string => userId.slice(-6);

export const groupCommentsByParent = (
  comments: Comment[]
): { topLevel: Comment[]; replies: Map<string, Comment[]> } => {
  const topLevel = comments.filter((c) => c.parent_id === null);
  const replies = new Map<string, Comment[]>();
  comments
    .filter((c) => c.parent_id !== null)
    .forEach((c) => {
      const existing = replies.get(c.parent_id!) ?? [];
      replies.set(c.parent_id!, [...existing, c]);
    });
  return { topLevel, replies };
};

export const validateCommentContent = (content: string): string | null => {
  const trimmed = content.trim();
  if (!trimmed) return "Comment cannot be empty";
  if (trimmed.length > 1000) return "Comment must be 1000 characters or less";
  return null;
};

export const formatRelativeTime = (isoString: string): string => {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
