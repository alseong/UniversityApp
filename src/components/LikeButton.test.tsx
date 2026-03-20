import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LikeButton from "./LikeButton";

vi.mock("@/app/like-actions", () => ({
  toggleLikeAction: vi.fn().mockResolvedValue({ liked: true }),
}));

vi.mock("../../supabase/client", () => ({ createClient: vi.fn() }));

import { createClient } from "../../supabase/client";
import { toggleLikeAction } from "@/app/like-actions";
const mockCreateClient = vi.mocked(createClient);
const mockToggle = vi.mocked(toggleLikeAction);

const makeSupabase = (count: number, userLiked: boolean, userId: string | null = "user-1") => ({
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: userLiked ? { user_id: userId } : null }),
    then: vi.fn().mockImplementation((resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
      Promise.resolve({ count, data: null, error: null }).then(resolve, reject)
    ),
  }),
});

beforeEach(() => vi.clearAllMocks());

describe("LikeButton", () => {
  it("renders like count after loading", async () => {
    mockCreateClient.mockReturnValue(makeSupabase(5, false) as any);
    render(<LikeButton submissionId="sub-1" userId="user-1" />);
    await waitFor(() => expect(screen.getByText("5")).toBeInTheDocument());
  });

  it("shows filled heart when already liked", async () => {
    mockCreateClient.mockReturnValue(makeSupabase(3, true) as any);
    render(<LikeButton submissionId="sub-1" userId="user-1" />);
    await waitFor(() =>
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Unlike")
    );
  });

  it("shows empty heart when not liked", async () => {
    mockCreateClient.mockReturnValue(makeSupabase(3, false) as any);
    render(<LikeButton submissionId="sub-1" userId="user-1" />);
    await waitFor(() =>
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Like")
    );
  });

  it("optimistically increments count on like", async () => {
    mockToggle.mockResolvedValue({ liked: true });
    mockCreateClient.mockReturnValue(makeSupabase(5, false) as any);
    render(<LikeButton submissionId="sub-1" userId="user-1" />);
    await waitFor(() => expect(screen.getByText("5")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("optimistically decrements count on unlike", async () => {
    mockToggle.mockResolvedValue({ liked: false });
    mockCreateClient.mockReturnValue(makeSupabase(5, true) as any);
    render(<LikeButton submissionId="sub-1" userId="user-1" />);
    await waitFor(() => expect(screen.getByText("5")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("reverts on server error", async () => {
    mockToggle.mockResolvedValue({ liked: false, error: "Failed" });
    mockCreateClient.mockReturnValue(makeSupabase(5, false) as any);
    render(<LikeButton submissionId="sub-1" userId="user-1" />);
    await waitFor(() => expect(screen.getByText("5")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByText("5")).toBeInTheDocument());
  });

  it("is disabled when user is not signed in", async () => {
    mockCreateClient.mockReturnValue(makeSupabase(5, false, null) as any);
    render(<LikeButton submissionId="sub-1" userId={null} />);
    await waitFor(() => expect(screen.getByRole("button")).toBeDisabled());
  });
});
