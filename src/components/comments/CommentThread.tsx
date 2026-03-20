"use client";

import { Comment } from "@/types/comments";
import { formatShortId, groupCommentsByParent, formatRelativeTime } from "@/utils/comments";
import { MessageSquare } from "lucide-react";
import { CommentInput } from "./CommentInput";

type Props = {
  comments: Comment[];
  currentUserId: string | null;
  replyingToId: string | null;
  onReply: (commentId: string) => void;
  onCancelReply: () => void;
  onSubmitComment: (content: string, parentId: string | null) => Promise<{ error?: string }>;
};

export function CommentThread({
  comments,
  currentUserId,
  replyingToId,
  onReply,
  onCancelReply,
  onSubmitComment,
}: Props) {
  const { topLevel, replies } = groupCommentsByParent(comments);

  if (topLevel.length === 0 && !currentUserId) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No comments yet. Sign in to start a discussion.
      </p>
    );
  }

  if (topLevel.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground text-center py-2">
          No comments yet. Be the first!
        </p>
        <CommentInput
          onSubmit={(content) => onSubmitComment(content, null)}
          placeholder="Start the discussion..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topLevel.map((comment) => {
        const commentReplies = replies.get(comment.id) ?? [];
        return (
          <div key={comment.id} className="space-y-2">
            <div className="bg-muted/30 rounded-md p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-medium text-primary">
                  #{formatShortId(comment.user_id)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(comment.created_at)}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
              {currentUserId && replyingToId !== comment.id && (
                <button
                  onClick={() => onReply(comment.id)}
                  className="text-xs text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  Reply
                </button>
              )}
            </div>

            {commentReplies.length > 0 && (
              <div className="ml-6 space-y-2">
                {commentReplies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-muted/20 rounded-md p-3 border-l-2 border-border"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-medium text-primary">
                        #{formatShortId(reply.user_id)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(reply.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">{reply.content}</p>
                    {currentUserId && replyingToId !== reply.parent_id && (
                      <button
                        onClick={() => onReply(reply.parent_id!)}
                        className="text-xs text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Reply
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {replyingToId === comment.id && (
              <div className="ml-6">
                <CommentInput
                  onSubmit={(content) => onSubmitComment(content, comment.id)}
                  onCancel={onCancelReply}
                  placeholder="Write a reply..."
                  submitLabel="Post reply"
                />
              </div>
            )}
          </div>
        );
      })}

      {currentUserId && (
        <div className="pt-2 border-t border-border">
          <CommentInput onSubmit={(content) => onSubmitComment(content, null)} />
        </div>
      )}
    </div>
  );
}
