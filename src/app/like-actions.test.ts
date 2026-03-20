import { describe, it, expect, vi, beforeEach } from "vitest";
import { toggleLikeAction } from "./like-actions";

vi.mock("../../supabase/server", () => ({ createClient: vi.fn() }));

import { createClient } from "../../supabase/server";
const mockCreateClient = vi.mocked(createClient);

const makeSupabase = (userId: string | null, existingLike: unknown) => {
  const likesChain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: existingLike }),
  };
  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: userId ? { id: userId } : null } }) },
    from: vi.fn().mockReturnValue(likesChain),
  };
};

beforeEach(() => vi.clearAllMocks());

describe("toggleLikeAction", () => {
  it("returns error when user is not signed in", async () => {
    mockCreateClient.mockResolvedValue(makeSupabase(null, null) as any);
    const result = await toggleLikeAction("sub-1");
    expect(result.error).toBeDefined();
  });

  it("inserts a like when user has not liked yet", async () => {
    const supabase = makeSupabase("user-1", null);
    mockCreateClient.mockResolvedValue(supabase as any);
    const result = await toggleLikeAction("sub-1");
    expect(result.liked).toBe(true);
    expect(supabase.from("likes").insert).toHaveBeenCalled();
  });

  it("deletes the like when user has already liked", async () => {
    const supabase = makeSupabase("user-1", { user_id: "user-1" });
    mockCreateClient.mockResolvedValue(supabase as any);
    const result = await toggleLikeAction("sub-1");
    expect(result.liked).toBe(false);
    expect(supabase.from("likes").delete).toHaveBeenCalled();
  });
});
