"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { validateCommentContent } from "@/utils/comments";

type Props = {
  onSubmit: (content: string) => Promise<{ error?: string }>;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
};

export function CommentInput({
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  submitLabel = "Post",
}: Props) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const validationError = validateCommentContent(content);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await onSubmit(content.trim());
    if (result.error) {
      setError(result.error);
    } else {
      setContent("");
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        aria-label="Comment text"
        className="w-full text-sm border border-border rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={submitting || !content.trim()}
        >
          {submitting ? "Posting..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}
