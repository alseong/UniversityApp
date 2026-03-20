import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SubmissionPage from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }),
  redirect: vi.fn((url: string) => { throw new Error(`NEXT_REDIRECT:${url}`); }),
}));

vi.mock("../../../../supabase/server", () => ({
  createClient: vi.fn(),
}));

const commentsChain = { select: vi.fn(), eq: vi.fn(), order: vi.fn(), then: vi.fn() };
commentsChain.select.mockReturnValue(commentsChain);
commentsChain.eq.mockReturnValue(commentsChain);
commentsChain.order.mockReturnValue(commentsChain);
commentsChain.then.mockImplementation((resolve: (v: unknown) => void) => resolve({ data: [], count: 0, error: null }));

vi.mock("../../../../supabase/client", () => ({
  createClient: () => ({
    from: vi.fn(() => commentsChain),
  }),
}));

import { createClient } from "../../../../supabase/server";
const mockCreateClient = vi.mocked(createClient);

const makeSupabase = (data: unknown, error: unknown = null, user: unknown = { id: "user-1" }) => ({
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user } }),
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
  }),
});

const makeRecord = (overrides = {}) => ({
  id: "sub-1",
  user_id: "user-1",
  university_attendance: "2026",
  universities: [{ name: "UofT", program: "Computer Science", status: "accepted" }],
  grades: [],
  avg_grade_11: "92",
  avg_grade_12: null,
  other_achievements: "Math olympiad",
  high_school: "Westview SS",
  ...overrides,
});

describe("SubmissionPage", () => {
  it("renders the university name from the record", async () => {
    mockCreateClient.mockResolvedValue(makeSupabase(makeRecord()) as any);
    const page = await SubmissionPage({ params: Promise.resolve({ id: "sub-1" }) });
    render(page);
    expect(screen.getByText("UofT")).toBeInTheDocument();
  });

  it("renders the program from the record", async () => {
    mockCreateClient.mockResolvedValue(makeSupabase(makeRecord()) as any);
    const page = await SubmissionPage({ params: Promise.resolve({ id: "sub-1" }) });
    render(page);
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
  });

  it("renders the high school when present", async () => {
    mockCreateClient.mockResolvedValue(makeSupabase(makeRecord()) as any);
    const page = await SubmissionPage({ params: Promise.resolve({ id: "sub-1" }) });
    render(page);
    expect(screen.getByText("Westview SS")).toBeInTheDocument();
  });

  it("calls notFound when record does not exist", async () => {
    mockCreateClient.mockResolvedValue(makeSupabase(null) as any);
    await expect(
      SubmissionPage({ params: Promise.resolve({ id: "nonexistent" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("redirects to sign-in when user is not authenticated", async () => {
    mockCreateClient.mockResolvedValue(makeSupabase(makeRecord(), null, null) as any);
    await expect(
      SubmissionPage({ params: Promise.resolve({ id: "sub-1" }) })
    ).rejects.toThrow("NEXT_REDIRECT:/sign-in");
  });
});
