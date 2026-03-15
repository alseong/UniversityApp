import { describe, it, expect } from "vitest";
import {
  formatShortId,
  groupCommentsByParent,
  validateCommentContent,
  formatRelativeTime,
} from "./comments";
import { Comment } from "@/types/comments";

const makeComment = (overrides: Partial<Comment> = {}): Comment => ({
  id: "c1",
  submission_id: "sub-1",
  user_id: "aaaa-bbbb-cccc-dddd-eeff",
  parent_id: null,
  content: "Test comment",
  created_at: new Date().toISOString(),
  ...overrides,
});

describe("formatShortId", () => {
  it("returns last 6 characters of user id", () => {
    expect(formatShortId("a1b2c3d4-e5f6-7890-abcd-ef1234567890")).toBe("567890");
  });

  it("returns full string if shorter than 6 chars", () => {
    expect(formatShortId("abc")).toBe("abc");
  });

  it("returns exactly 6 chars for a standard uuid", () => {
    expect(formatShortId("aaaa-bbbb-cccc-dddd-eeff")).toHaveLength(6);
  });
});

describe("groupCommentsByParent", () => {
  it("separates top-level comments from replies", () => {
    const comments = [
      makeComment({ id: "c1", parent_id: null }),
      makeComment({ id: "c2", parent_id: null }),
      makeComment({ id: "c3", parent_id: "c1" }),
    ];
    const { topLevel, replies } = groupCommentsByParent(comments);
    expect(topLevel).toHaveLength(2);
    expect(replies.get("c1")).toHaveLength(1);
  });

  it("returns empty replies map when no replies exist", () => {
    const comments = [makeComment({ id: "c1", parent_id: null })];
    const { topLevel, replies } = groupCommentsByParent(comments);
    expect(topLevel).toHaveLength(1);
    expect(replies.size).toBe(0);
  });

  it("groups multiple replies under correct parent", () => {
    const comments = [
      makeComment({ id: "c1", parent_id: null }),
      makeComment({ id: "c2", parent_id: "c1" }),
      makeComment({ id: "c3", parent_id: "c1" }),
    ];
    const { replies } = groupCommentsByParent(comments);
    expect(replies.get("c1")).toHaveLength(2);
  });

  it("returns empty top-level when all comments are replies", () => {
    const comments = [
      makeComment({ id: "c2", parent_id: "c1" }),
      makeComment({ id: "c3", parent_id: "c1" }),
    ];
    const { topLevel } = groupCommentsByParent(comments);
    expect(topLevel).toHaveLength(0);
  });

  it("preserves comment order", () => {
    const comments = [
      makeComment({ id: "c1", content: "first" }),
      makeComment({ id: "c2", content: "second" }),
    ];
    const { topLevel } = groupCommentsByParent(comments);
    expect(topLevel[0].content).toBe("first");
    expect(topLevel[1].content).toBe("second");
  });
});

describe("validateCommentContent", () => {
  it("returns null for valid content", () => {
    expect(validateCommentContent("Hello world")).toBeNull();
  });

  it("returns error for empty string", () => {
    expect(validateCommentContent("")).toBeTruthy();
  });

  it("returns error for whitespace-only content", () => {
    expect(validateCommentContent("   ")).toBeTruthy();
  });

  it("returns error for content over 1000 chars", () => {
    expect(validateCommentContent("a".repeat(1001))).toBeTruthy();
  });

  it("returns null for content at exactly 1000 chars", () => {
    expect(validateCommentContent("a".repeat(1000))).toBeNull();
  });
});

describe("formatRelativeTime", () => {
  it("returns 'just now' for recent timestamps", () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe("just now");
  });

  it("returns minutes ago for timestamps within an hour", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMinutesAgo)).toBe("5m ago");
  });

  it("returns hours ago for timestamps within a day", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoHoursAgo)).toBe("2h ago");
  });

  it("returns days ago for timestamps older than a day", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoDaysAgo)).toBe("2d ago");
  });
});
