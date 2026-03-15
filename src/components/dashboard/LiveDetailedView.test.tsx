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

const commentsChain = { select: vi.fn(), eq: vi.fn(), order: vi.fn(), then: vi.fn() };
commentsChain.select.mockReturnValue(commentsChain);
commentsChain.eq.mockReturnValue(commentsChain);
commentsChain.order.mockReturnValue(commentsChain);
commentsChain.then.mockImplementation((resolve: (v: unknown) => void) =>
  resolve({ data: [], count: 0, error: null })
);

vi.mock("../../../supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
    },
    from: vi.fn((table: string) => (table === "comments" ? commentsChain : admissionsChain)),
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
