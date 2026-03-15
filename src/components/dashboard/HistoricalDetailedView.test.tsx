import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HistoricalDetailedView from "./HistoricalDetailedView";
import { AdmissionRecord } from "@/types/dashboard";

vi.mock("@/utils/data", () => ({
  useProcessedAdmissionData: () => ({
    allRecords: [],
    schools: ["All"],
    programs: ["All"],
    statuses: ["All"],
    attendingYears: ["All"],
    schoolCounts: {},
    programCounts: {},
    acceptedRecords: [],
  }),
}));

const makeRecord = (overrides: Partial<AdmissionRecord> = {}): AdmissionRecord => ({
  Status: "Accepted",
  School: ["University of Toronto"],
  Program: ["Computer Science"],
  Average: 92,
  "Date Accepted": "",
  "Type (101/105)": "",
  Discord: "",
  Other: "",
  "Attending Year": "2023",
  ...overrides,
});

const records: AdmissionRecord[] = [
  makeRecord({ School: ["University of Toronto"], Program: ["Computer Science"], Status: "Accepted", "Attending Year": "2023" }),
  makeRecord({ School: ["McGill University"], Program: ["Computer Science"], Status: "Rejected", "Attending Year": "2023" }),
  makeRecord({ School: ["University of Toronto"], Program: ["Mathematics"], Status: "Accepted", "Attending Year": "2023" }),
];

describe("HistoricalDetailedView", () => {
  it("shows a record count reflecting number of records", () => {
    render(<HistoricalDetailedView records={records} year="2023" />);
    expect(screen.getByText(/3 record/i)).toBeInTheDocument();
  });

  it("shows all records when no filters are active", () => {
    render(<HistoricalDetailedView records={records} year="2023" />);
    expect(screen.getAllByText(/university of toronto/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/mcgill university/i)).toBeInTheDocument();
  });

  it("shows empty state when no records match filters", async () => {
    render(<HistoricalDetailedView records={[]} year="2024" />);
    expect(screen.getByText(/no records/i)).toBeInTheDocument();
  });

  it("displays school name for each record", () => {
    render(<HistoricalDetailedView records={records} year="2023" />);
    expect(screen.getByText(/mcgill university/i)).toBeInTheDocument();
  });

  it("displays program name for each record", () => {
    render(<HistoricalDetailedView records={records} year="2023" />);
    expect(screen.getAllByText(/computer science/i).length).toBeGreaterThanOrEqual(1);
  });

  it("displays admission status for each record", () => {
    render(<HistoricalDetailedView records={records} year="2023" />);
    expect(screen.getAllByText(/accepted/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/rejected/i).length).toBeGreaterThanOrEqual(1);
  });
});
