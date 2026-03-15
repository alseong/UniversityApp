import { describe, it, expect } from "vitest";
import { formatAttendanceYear } from "./formatAttendanceYear";

describe("formatAttendanceYear", () => {
  it("returns the 4-digit year from '2027_onwards'", () => {
    expect(formatAttendanceYear("2027_onwards")).toBe("2027");
  });

  it("returns the 4-digit year from 'fall_2026'", () => {
    expect(formatAttendanceYear("fall_2026")).toBe("2026");
  });

  it("returns the 4-digit year from 'spring_2026'", () => {
    expect(formatAttendanceYear("spring_2026")).toBe("2026");
  });

  it("returns the 4-digit year from 'winter_2026'", () => {
    expect(formatAttendanceYear("winter_2026")).toBe("2026");
  });

  it("returns the 4-digit year from 'fall_2027'", () => {
    expect(formatAttendanceYear("fall_2027")).toBe("2027");
  });

  it("passes through a plain year string", () => {
    expect(formatAttendanceYear("2024")).toBe("2024");
  });

  it("returns empty string for empty input", () => {
    expect(formatAttendanceYear("")).toBe("");
  });
});
