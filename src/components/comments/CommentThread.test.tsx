import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommentThread } from "./CommentThread";
import { Comment } from "@/types/comments";

const makeComment = (overrides: Partial<Comment> = {}): Comment => ({
  id: "c1",
  submission_id: "sub-1",
  user_id: "aaaa-bbbb-cccc-dddd-1234",
  parent_id: null,
  content: "Test comment",
  created_at: new Date().toISOString(),
  ...overrides,
});

const defaultProps = {
  comments: [],
  currentUserId: "user-123",
  replyingToId: null,
  onReply: vi.fn(),
  onCancelReply: vi.fn(),
  onSubmitComment: vi.fn().mockResolvedValue({}),
};

describe("CommentThread", () => {
  it("shows empty state with input when no comments and user is signed in", () => {
    render(<CommentThread {...defaultProps} />);
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("shows sign-in prompt when no comments and user is not signed in", () => {
    render(<CommentThread {...defaultProps} currentUserId={null} />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("displays comment content", () => {
    const comments = [makeComment({ content: "Great insights!" })];
    render(<CommentThread {...defaultProps} comments={comments} />);
    expect(screen.getByText("Great insights!")).toBeInTheDocument();
  });

  it("displays short user id for comment author", () => {
    const comments = [makeComment({ user_id: "aaaa-bbbb-cccc-dddd-001234" })];
    render(<CommentThread {...defaultProps} comments={comments} />);
    expect(screen.getByText(/#001234/i)).toBeInTheDocument();
  });

  it("shows reply button on top-level comments when user is signed in", () => {
    const comments = [makeComment({ id: "c1" })];
    render(<CommentThread {...defaultProps} comments={comments} />);
    expect(screen.getByRole("button", { name: /reply/i })).toBeInTheDocument();
  });

  it("does not show reply button when user is not signed in", () => {
    const comments = [makeComment({ id: "c1" })];
    render(<CommentThread {...defaultProps} comments={comments} currentUserId={null} />);
    expect(screen.queryByRole("button", { name: /reply/i })).not.toBeInTheDocument();
  });

  it("calls onReply with comment id when reply button clicked", async () => {
    const onReply = vi.fn();
    const comments = [makeComment({ id: "c1" })];
    render(<CommentThread {...defaultProps} comments={comments} onReply={onReply} />);
    await userEvent.click(screen.getByRole("button", { name: /reply/i }));
    expect(onReply).toHaveBeenCalledWith("c1");
  });

  it("shows reply input when replyingToId matches a comment", () => {
    const comments = [makeComment({ id: "c1" })];
    render(<CommentThread {...defaultProps} comments={comments} replyingToId="c1" />);
    expect(screen.getByPlaceholderText(/write a reply/i)).toBeInTheDocument();
  });

  it("hides reply button for the comment currently being replied to", () => {
    const comments = [makeComment({ id: "c1" })];
    render(<CommentThread {...defaultProps} comments={comments} replyingToId="c1" />);
    expect(screen.queryByRole("button", { name: /^reply$/i })).not.toBeInTheDocument();
  });

  it("shows replies indented under their parent comment", () => {
    const comments = [
      makeComment({ id: "c1", content: "Top comment" }),
      makeComment({ id: "c2", parent_id: "c1", content: "A reply" }),
    ];
    render(<CommentThread {...defaultProps} comments={comments} />);
    expect(screen.getByText("Top comment")).toBeInTheDocument();
    expect(screen.getByText("A reply")).toBeInTheDocument();
  });

  it("shows add-comment input at bottom for signed-in users when comments exist", () => {
    const comments = [makeComment({ id: "c1", content: "Existing comment" })];
    render(<CommentThread {...defaultProps} comments={comments} />);
    expect(screen.getAllByRole("textbox").length).toBeGreaterThanOrEqual(1);
  });

  it("does not show add-comment input when user is not signed in", () => {
    const comments = [makeComment({ id: "c1" })];
    render(<CommentThread {...defaultProps} comments={comments} currentUserId={null} />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("calls onCancelReply when cancel is clicked in reply input", async () => {
    const onCancelReply = vi.fn();
    const comments = [makeComment({ id: "c1" })];
    render(
      <CommentThread
        {...defaultProps}
        comments={comments}
        replyingToId="c1"
        onCancelReply={onCancelReply}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancelReply).toHaveBeenCalled();
  });
});
