"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useComments } from "@/utils/commentHooks";
import { postCommentAction } from "@/app/comment-actions";
import { CommentThread } from "./CommentThread";

type Props = {
  submissionId: string;
  currentUserId: string | null;
  defaultOpen?: boolean;
};

export function CommentSection({ submissionId, currentUserId, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const { comments, count, loading, error, fetchComments } = useComments(submissionId);

  useEffect(() => {
    if (isOpen) fetchComments();
  }, [isOpen]);

  const handleSubmitComment = async (content: string, parentId: string | null) => {
    const formData = new FormData();
    formData.set("submission_id", submissionId);
    formData.set("content", content);
    if (parentId) formData.set("parent_id", parentId);
    const result = await postCommentAction(formData);
    if (!result.error) {
      setReplyingToId(null);
      await fetchComments();
    }
    return result;
  };

  const label = count > 0 ? `Comments (${count})` : "Comments";

  return (
    <div className="border-t border-border mt-4 pt-3">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
        aria-expanded={isOpen}
        aria-controls={`comments-${submissionId}`}
      >
        <MessageSquare className="w-4 h-4" />
        <span>{label}</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 ml-auto" />
        ) : (
          <ChevronDown className="w-3 h-3 ml-auto" />
        )}
      </button>

      {isOpen && (
        <div id={`comments-${submissionId}`} className="mt-3">
          {loading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading comments...
            </p>
          )}
          {error && (
            <p className="text-sm text-destructive text-center py-4">
              Failed to load comments.
            </p>
          )}
          {!loading && !error && (
            <CommentThread
              comments={comments}
              currentUserId={currentUserId}
              replyingToId={replyingToId}
              onReply={setReplyingToId}
              onCancelReply={() => setReplyingToId(null)}
              onSubmitComment={handleSubmitComment}
            />
          )}
        </div>
      )}
    </div>
  );
}
