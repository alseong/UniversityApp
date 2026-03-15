import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useComments } from "./commentHooks";

const makeChain = (resolveValue: unknown) => {
  const chain: Record<string, unknown> = {};
  const thenable = {
    ...chain,
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    then: vi.fn((resolve: (v: unknown) => void) => resolve(resolveValue)),
  };
  thenable.select.mockReturnValue(thenable);
  thenable.eq.mockReturnValue(thenable);
  thenable.order.mockReturnValue(thenable);
  return thenable;
};

let mockChain = makeChain({ data: [], error: null, count: 0 });

vi.mock("../../supabase/client", () => ({
  createClient: () => ({ from: vi.fn(() => mockChain) }),
}));

beforeEach(() => {
  mockChain = makeChain({ data: [], error: null, count: 0 });
});

describe("useComments", () => {
  it("exposes a count fetched eagerly on mount", async () => {
    mockChain = makeChain({ data: [], error: null, count: 3 });
    const { result } = renderHook(() => useComments("sub-1"));
    await waitFor(() => expect(result.current.count).toBe(3));
  });

  it("count starts at 0 before data resolves", () => {
    mockChain = makeChain(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useComments("sub-1"));
    expect(result.current.count).toBe(0);
  });
});
