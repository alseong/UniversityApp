import { describe, it, expect } from "vitest";
import {
  filterHistoricalByYear,
  filterHistoricalBySchool,
  filterHistoricalByProgram,
  filterHistoricalByStatus,
  applyHistoricalFilters,
  type HistoricalDetailedFilter,
} from "./historicalFilters";
import { AdmissionRecord } from "@/types/dashboard";

const makeRecord = (
  overrides: Partial<AdmissionRecord> = {}
): AdmissionRecord => ({
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

describe("filterHistoricalByYear", () => {
  it("returns all records when year is 'All'", () => {
    const records = [
      makeRecord({ "Attending Year": "2021" }),
      makeRecord({ "Attending Year": "2022" }),
    ];
    expect(filterHistoricalByYear(records, "All")).toHaveLength(2);
  });

  it("returns only records matching the selected year", () => {
    const records = [
      makeRecord({ "Attending Year": "2021" }),
      makeRecord({ "Attending Year": "2022" }),
      makeRecord({ "Attending Year": "2022" }),
    ];
    expect(filterHistoricalByYear(records, "2022")).toHaveLength(2);
  });

  it("returns empty array when no records match the year", () => {
    const records = [makeRecord({ "Attending Year": "2021" })];
    expect(filterHistoricalByYear(records, "2025")).toHaveLength(0);
  });
});

describe("filterHistoricalBySchool", () => {
  it("returns all records when school is 'All'", () => {
    const records = [
      makeRecord({ School: ["UofT"] }),
      makeRecord({ School: ["McGill"] }),
    ];
    expect(filterHistoricalBySchool(records, "All")).toHaveLength(2);
  });

  it("returns only records where school is included", () => {
    const records = [
      makeRecord({ School: ["UofT"] }),
      makeRecord({ School: ["McGill"] }),
      makeRecord({ School: ["UofT", "McGill"] }),
    ];
    expect(filterHistoricalBySchool(records, "UofT")).toHaveLength(2);
  });
});

describe("filterHistoricalByProgram", () => {
  it("returns all records when program is 'All'", () => {
    const records = [
      makeRecord({ Program: ["CS"] }),
      makeRecord({ Program: ["Math"] }),
    ];
    expect(filterHistoricalByProgram(records, "All")).toHaveLength(2);
  });

  it("returns only records where program is included", () => {
    const records = [
      makeRecord({ Program: ["CS"] }),
      makeRecord({ Program: ["Math"] }),
      makeRecord({ Program: ["CS", "Math"] }),
    ];
    expect(filterHistoricalByProgram(records, "CS")).toHaveLength(2);
  });
});

describe("filterHistoricalByStatus", () => {
  it("returns all records when status is 'All'", () => {
    const records = [
      makeRecord({ Status: "Accepted" }),
      makeRecord({ Status: "Rejected" }),
    ];
    expect(filterHistoricalByStatus(records, "All")).toHaveLength(2);
  });

  it("returns only records matching the status", () => {
    const records = [
      makeRecord({ Status: "Accepted" }),
      makeRecord({ Status: "Rejected" }),
      makeRecord({ Status: "Accepted" }),
    ];
    expect(filterHistoricalByStatus(records, "Accepted")).toHaveLength(2);
  });
});

describe("applyHistoricalFilters", () => {
  it("applies all filters in combination", () => {
    const records = [
      makeRecord({ School: ["UofT"], Program: ["CS"], Status: "Accepted", "Attending Year": "2023" }),
      makeRecord({ School: ["McGill"], Program: ["CS"], Status: "Accepted", "Attending Year": "2023" }),
      makeRecord({ School: ["UofT"], Program: ["Math"], Status: "Accepted", "Attending Year": "2023" }),
      makeRecord({ School: ["UofT"], Program: ["CS"], Status: "Rejected", "Attending Year": "2023" }),
      makeRecord({ School: ["UofT"], Program: ["CS"], Status: "Accepted", "Attending Year": "2022" }),
    ];
    const filters: HistoricalDetailedFilter = {
      school: "UofT",
      program: "CS",
      status: "Accepted",
    };
    const result = applyHistoricalFilters(records, "2023", filters);
    expect(result).toHaveLength(1);
    expect(result[0].School).toContain("UofT");
    expect(result[0].Program).toContain("CS");
    expect(result[0].Status).toBe("Accepted");
    expect(result[0]["Attending Year"]).toBe("2023");
  });

  it("returns all records when all filters are 'All' and year is 'All'", () => {
    const records = [makeRecord(), makeRecord(), makeRecord()];
    const filters: HistoricalDetailedFilter = {
      school: "All",
      program: "All",
      status: "All",
    };
    expect(applyHistoricalFilters(records, "All", filters)).toHaveLength(3);
  });
});
