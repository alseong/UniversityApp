import { describe, it, expect } from "vitest";
import { transformSupabaseToAdmissionRecords } from "./supabaseTransform";

const makeRow = (overrides: Record<string, unknown> = {}) => ({
  id: "abc123",
  user_id: "user-1",
  university_attendance: "fall_2026",
  avg_grade_12: null,
  avg_grade_11: null,
  grades: [],
  universities: [{ name: "University of Toronto", program: "Computer Science", status: "accepted" }],
  other_achievements: "",
  high_school: "Test High School",
  ...overrides,
});

describe("transformSupabaseToAdmissionRecords", () => {
  it("returns empty array when input is empty", () => {
    expect(transformSupabaseToAdmissionRecords([])).toEqual([]);
  });

  it("skips rows with no universities", () => {
    const result = transformSupabaseToAdmissionRecords([makeRow({ universities: [] })]);
    expect(result).toHaveLength(0);
  });

  it("skips rows where universities is null", () => {
    const result = transformSupabaseToAdmissionRecords([makeRow({ universities: null })]);
    expect(result).toHaveLength(0);
  });

  it("skips university entries with empty name", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({ universities: [{ name: "", program: "CS", status: "accepted" }] }),
    ]);
    expect(result).toHaveLength(0);
  });

  it("skips university entries with empty program", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({ universities: [{ name: "UofT", program: "  ", status: "accepted" }] }),
    ]);
    expect(result).toHaveLength(0);
  });

  it("maps university name and program to School and Program arrays", () => {
    const result = transformSupabaseToAdmissionRecords([makeRow()]);
    expect(result[0].School).toEqual(["University of Toronto"]);
    expect(result[0].Program).toEqual(["Computer Science"]);
  });

  it("normalizes accepted status to Offer", () => {
    const result = transformSupabaseToAdmissionRecords([makeRow()]);
    expect(result[0].Status).toBe("Offer");
  });

  it("normalizes received_offer_and_accepted status to Accepted", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({ universities: [{ name: "UofT", program: "CS", status: "received_offer_and_accepted" }] }),
    ]);
    expect(result[0].Status).toBe("Accepted");
  });

  it("normalizes rejected status to Rejected", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({ universities: [{ name: "UofT", program: "CS", status: "rejected" }] }),
    ]);
    expect(result[0].Status).toBe("Rejected");
  });

  it("normalizes pending status to Applied", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({ universities: [{ name: "UofT", program: "CS", status: "pending" }] }),
    ]);
    expect(result[0].Status).toBe("Applied");
  });

  it("defaults to Applied when status is missing", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({ universities: [{ name: "UofT", program: "CS", status: undefined }] }),
    ]);
    expect(result[0].Status).toBe("Applied");
  });

  it("extracts year from university_attendance string", () => {
    const result = transformSupabaseToAdmissionRecords([makeRow({ university_attendance: "fall_2026" })]);
    expect(result[0]["Attending Year"]).toBe("2026");
  });

  it("extracts year from spring variant", () => {
    const result = transformSupabaseToAdmissionRecords([makeRow({ university_attendance: "spring_2027" })]);
    expect(result[0]["Attending Year"]).toBe("2027");
  });

  it("treats 2027_onwards as year 2027", () => {
    const result = transformSupabaseToAdmissionRecords([makeRow({ university_attendance: "2027_onwards" })]);
    expect(result[0]["Attending Year"]).toBe("2027");
  });

  it("uses avg_grade_12 as average when available", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({ avg_grade_12: "94.5", avg_grade_11: "88.0" }),
    ]);
    expect(result[0].Average).toBe(94.5);
  });

  it("falls back to avg_grade_11 when avg_grade_12 is null", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({ avg_grade_12: null, avg_grade_11: "88.0" }),
    ]);
    expect(result[0].Average).toBe(88);
  });

  it("calculates average from individual grade_12 courses when avg fields are null", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({
        avg_grade_12: null,
        avg_grade_11: null,
        grades: [
          { level: "grade_12", grade: "90" },
          { level: "grade_12", grade: "80" },
        ],
      }),
    ]);
    expect(result[0].Average).toBe(85);
  });

  it("falls back to grade_11 courses when no grade_12 courses exist", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({
        avg_grade_12: null,
        avg_grade_11: null,
        grades: [
          { level: "grade_11", grade: "75" },
          { level: "grade_11", grade: "85" },
        ],
      }),
    ]);
    expect(result[0].Average).toBe(80);
  });

  it("sets Average to null when no grade data exists", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({ avg_grade_12: null, avg_grade_11: null, grades: [] }),
    ]);
    expect(result[0].Average).toBeNull();
  });

  it("ignores grade entries with null or empty grade values", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({
        avg_grade_12: null,
        avg_grade_11: null,
        grades: [
          { level: "grade_12", grade: null },
          { level: "grade_12", grade: "" },
          { level: "grade_12", grade: "92" },
        ],
      }),
    ]);
    expect(result[0].Average).toBe(92);
  });

  it("produces one record per university entry", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({
        universities: [
          { name: "UofT", program: "CS", status: "accepted" },
          { name: "McGill", program: "Math", status: "rejected" },
        ],
      }),
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].School).toEqual(["UofT"]);
    expect(result[1].School).toEqual(["McGill"]);
  });

  it("shares the same average across all university entries from one row", () => {
    const result = transformSupabaseToAdmissionRecords([
      makeRow({
        avg_grade_12: "91.0",
        universities: [
          { name: "UofT", program: "CS", status: "accepted" },
          { name: "McMaster", program: "Engineering", status: "waitlisted" },
        ],
      }),
    ]);
    expect(result[0].Average).toBe(91);
    expect(result[1].Average).toBe(91);
  });

  it("aggregates records from multiple rows", () => {
    const result = transformSupabaseToAdmissionRecords([makeRow(), makeRow()]);
    expect(result).toHaveLength(2);
  });
});
