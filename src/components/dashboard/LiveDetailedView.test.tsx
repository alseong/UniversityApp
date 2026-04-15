import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LiveDetailedView from "./LiveDetailedView";

// Generates N unique records
const makeRecords = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: `sub-${i}`,
    user_id: `user-${i}`,
    university_attendance: "2026",
    universities: [{ name: `University ${i}`, program: "CS", status: "accepted" }],
    grades: [],
    other_achievements: `Achievement ${i}`,
  }));

const mockData = makeRecords(2);
mockData[0].universities[0].name = "UofT";
mockData[1].universities[0].name = "McGill";

const admissionsChain = { select: vi.fn(), ilike: vi.fn(), order: vi.fn(), limit: vi.fn() };
admissionsChain.select.mockReturnValue(admissionsChain);
admissionsChain.ilike.mockReturnValue(admissionsChain);
admissionsChain.order.mockReturnValue(admissionsChain);
admissionsChain.limit.mockResolvedValue({ data: mockData, error: null });

const commentsChain: Record<string, ReturnType<typeof vi.fn>> = {
  select: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
  then: vi.fn(),
  maybeSingle: vi.fn(),
  in: vi.fn(),
  limit: vi.fn(),
};
commentsChain.select.mockReturnValue(commentsChain);
commentsChain.eq.mockReturnValue(commentsChain);
commentsChain.order.mockReturnValue(commentsChain);
commentsChain.maybeSingle.mockResolvedValue({ data: null });
commentsChain.then.mockImplementation((resolve: (v: unknown) => void) =>
  resolve({ data: [], count: 0, error: null })
);
commentsChain.in.mockResolvedValue({ data: [], error: null });
commentsChain.limit.mockReturnValue(commentsChain);

const likesChain: Record<string, ReturnType<typeof vi.fn>> = {
  select: vi.fn(),
  eq: vi.fn(),
  maybeSingle: vi.fn(),
  then: vi.fn(),
  in: vi.fn(),
  limit: vi.fn(),
};
likesChain.select.mockReturnValue(likesChain);
likesChain.eq.mockReturnValue(likesChain);
likesChain.maybeSingle.mockResolvedValue({ data: null });
likesChain.then.mockImplementation((resolve: (v: unknown) => void) =>
  resolve({ data: null, count: 0, error: null })
);
likesChain.in.mockResolvedValue({ data: [], error: null });
likesChain.limit.mockReturnValue(likesChain);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("../../../supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
    },
    from: vi.fn((table: string) => {
      if (table === "admissions_data") return admissionsChain;
      if (table === "likes") return likesChain;
      return commentsChain;
    }),
  }),
}));

// Mock IntersectionObserver (not available in jsdom)
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
class MockIntersectionObserver {
  observe = mockObserve;
  disconnect = mockDisconnect;
}
vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

beforeEach(() => {
  admissionsChain.limit.mockResolvedValue({ data: mockData, error: null });
  admissionsChain.ilike.mockClear();
  commentsChain.in.mockResolvedValue({ data: [], error: null });
  likesChain.in.mockResolvedValue({ data: [], error: null });
  likesChain.then.mockImplementation((resolve: (v: unknown) => void) =>
    resolve({ data: null, count: 0, error: null })
  );
  mockObserve.mockClear();
  mockDisconnect.mockClear();
});

describe("LiveDetailedView", () => {
  it("renders records after loading", async () => {
    render(<LiveDetailedView allRecords={[]} liveYears={["2026", "2027"]} historicalYears={[]} />);
    await waitFor(() => expect(screen.getByText("UofT")).toBeInTheDocument());
    expect(screen.getByText("McGill")).toBeInTheDocument();
  });

  it("filters records by selected year", async () => {
    render(<LiveDetailedView allRecords={[]} liveYears={["2027", "2026"]} historicalYears={[]} />);
    await waitFor(() => expect(screen.getByText("UofT")).toBeInTheDocument());

    await userEvent.click(screen.getByText("Filters"));
    await userEvent.click(screen.getByText("2027"));

    expect(admissionsChain.ilike).toHaveBeenCalledWith("university_attendance", "%2027%");
  });

  it("defaults to the last live year and applies ilike filter", async () => {
    render(<LiveDetailedView allRecords={[]} liveYears={["2027", "2026"]} historicalYears={[]} />);
    await waitFor(() => expect(screen.getByText("UofT")).toBeInTheDocument());
    expect(admissionsChain.ilike).toHaveBeenCalledWith("university_attendance", "%2026%");
  });

  it("shows profile completion modal when incomplete user changes a restricted filter", async () => {
    render(
      <LiveDetailedView
        allRecords={[]}
        liveYears={["2027", "2026"]}
        historicalYears={[]}
        hasSufficientData={false}
        userData={null}
      />
    );
    await waitFor(() => expect(screen.getByText("UofT")).toBeInTheDocument());

    await userEvent.click(screen.getByText("Filters"));
    // Program filter (second combobox) is restricted
    await userEvent.click(screen.getAllByRole("combobox")[1]);
    const csOptions = screen.getAllByText("CS");
    await userEvent.click(csOptions[csOptions.length - 1]);

    await waitFor(() =>
      expect(screen.getByText("Complete Your Profile to View")).toBeInTheDocument()
    );
  });

  it("allows university filter without profile completion modal", async () => {
    render(
      <LiveDetailedView
        allRecords={[]}
        liveYears={["2027", "2026"]}
        historicalYears={[]}
        hasSufficientData={false}
        userData={null}
      />
    );
    await waitFor(() => expect(screen.getByText("UofT")).toBeInTheDocument());

    await userEvent.click(screen.getByText("Filters"));
    await userEvent.click(screen.getAllByRole("combobox")[0]);
    const uoftOptions = screen.getAllByText("UofT");
    await userEvent.click(uoftOptions[uoftOptions.length - 1]);

    expect(screen.queryByText("Complete Your Profile to View")).not.toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("McGill")).not.toBeInTheDocument());
  });

  it("disables historical year tabs", async () => {
    render(<LiveDetailedView allRecords={[]} liveYears={["2027", "2026"]} historicalYears={["2025", "2024"]} />);
    await waitFor(() => expect(screen.getByText("UofT")).toBeInTheDocument());

    await userEvent.click(screen.getByText("Filters"));

    expect(screen.getByRole("button", { name: "2025" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "2024" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /2027/ })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /2026/ })).not.toBeDisabled();
  });

  it("renders only PAGE_SIZE records initially when there are more", async () => {
    const largeData = makeRecords(25);
    admissionsChain.limit.mockResolvedValue({ data: largeData, error: null });
    render(<LiveDetailedView allRecords={[]} liveYears={["2026", "2027"]} historicalYears={[]} />);
    await waitFor(() =>
      expect(screen.getByText("University 0")).toBeInTheDocument()
    );
    expect(screen.queryByText("University 14")).toBeInTheDocument();
    expect(screen.queryByText("University 15")).not.toBeInTheDocument();
  });

  it("sorts submissions by engagement (comments + likes) descending by default", async () => {
    // sub-0 (UofT): 0 comments, 0 likes → score 0
    // sub-1 (McGill): 1 comment, 2 likes → score 3
    // McGill should appear before UofT
    commentsChain.then.mockImplementationOnce((resolve: (v: unknown) => void) =>
      resolve({ data: [{ submission_id: "sub-1" }], error: null })
    );
    likesChain.then.mockImplementationOnce((resolve: (v: unknown) => void) =>
      resolve({ data: [{ submission_id: "sub-1" }, { submission_id: "sub-1" }], error: null })
    );

    render(<LiveDetailedView allRecords={[]} liveYears={["2026", "2027"]} historicalYears={[]} />);
    await waitFor(() => expect(screen.getByText("McGill")).toBeInTheDocument());

    const uoftEl = screen.getByText("UofT");
    const mcgillEl = screen.getByText("McGill");
    // DOCUMENT_POSITION_PRECEDING (2): mcgillEl precedes uoftEl → McGill rendered first
    expect(uoftEl.compareDocumentPosition(mcgillEl) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });

  it("resets to first page when filters change", async () => {
    const largeData = makeRecords(25);
    // All records have the same high school to keep them in filter
    largeData.forEach((r) => { (r as any).high_school = "Westview SS"; });
    // Give first record a unique university so we can filter on it
    largeData[0].universities[0].name = "UofT";
    admissionsChain.limit.mockResolvedValue({ data: largeData, error: null });

    render(<LiveDetailedView allRecords={[]} liveYears={["2026", "2027"]} historicalYears={[]} />);
    await waitFor(() => expect(screen.getByText("UofT")).toBeInTheDocument());

    // University 15 is beyond page 1
    expect(screen.queryByText("University 15")).not.toBeInTheDocument();

    // Open filters panel first (collapsed by default)
    await userEvent.click(screen.getByText("Filters"));

    // Apply a university filter — filteredData shrinks to 1, visible resets
    await userEvent.click(screen.getAllByRole("combobox")[0]);
    // After opening the dropdown, multiple "UofT" elements exist (card + option).
    // The dropdown option is the last rendered occurrence.
    const uoftOptions = screen.getAllByText("UofT");
    await userEvent.click(uoftOptions[uoftOptions.length - 1]);

    // Only the UofT record should be visible, all others filtered out
    await waitFor(() =>
      expect(screen.queryByText("University 1")).not.toBeInTheDocument()
    );
    expect(screen.getAllByText("UofT").length).toBeGreaterThan(0);
  });
});
