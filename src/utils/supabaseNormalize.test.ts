import { describe, it, expect } from "vitest";
import { normalizeSupabaseStatus, extractAttendingYear, formatStatusLabel } from "./supabaseNormalize";

describe("normalizeSupabaseStatus", () => {
  it("maps received_offer_and_accepted to Accepted", () => {
    expect(normalizeSupabaseStatus("received_offer_and_accepted")).toBe("Accepted");
  });

  it("maps accepted to Offer", () => {
    expect(normalizeSupabaseStatus("accepted")).toBe("Offer");
  });

  it("maps early_acceptance to Offer", () => {
    expect(normalizeSupabaseStatus("early_acceptance")).toBe("Offer");
  });

  it("maps received_offer_and_rejected to Offer", () => {
    expect(normalizeSupabaseStatus("received_offer_and_rejected")).toBe("Offer");
  });

  it("maps rejected to Rejected", () => {
    expect(normalizeSupabaseStatus("rejected")).toBe("Rejected");
  });

  it("maps waitlisted to Waitlisted", () => {
    expect(normalizeSupabaseStatus("waitlisted")).toBe("Waitlisted");
  });

  it("maps deferred to Deferred", () => {
    expect(normalizeSupabaseStatus("deferred")).toBe("Deferred");
  });

  it("maps applied to Applied", () => {
    expect(normalizeSupabaseStatus("applied")).toBe("Applied");
  });

  it("leaves planning_on_applying unchanged", () => {
    expect(normalizeSupabaseStatus("planning_on_applying")).toBe("planning_on_applying");
  });

  it("maps pending to Applied", () => {
    expect(normalizeSupabaseStatus("pending")).toBe("Applied");
  });
});

describe("formatStatusLabel", () => {
  it("converts planning_on_applying to Planning on applying", () => {
    expect(formatStatusLabel("planning_on_applying")).toBe("Planning on applying");
  });

  it("leaves already-readable statuses unchanged", () => {
    expect(formatStatusLabel("Accepted")).toBe("Accepted");
    expect(formatStatusLabel("Rejected")).toBe("Rejected");
    expect(formatStatusLabel("Applied")).toBe("Applied");
    expect(formatStatusLabel("All")).toBe("All");
  });
});

describe("extractAttendingYear", () => {
  it("extracts year from 'fall_2026'", () => {
    expect(extractAttendingYear("fall_2026")).toBe("2026");
  });

  it("extracts year from 'spring_2026'", () => {
    expect(extractAttendingYear("spring_2026")).toBe("2026");
  });

  it("extracts year from 'winter_2026'", () => {
    expect(extractAttendingYear("winter_2026")).toBe("2026");
  });

  it("extracts year from '2027_onwards'", () => {
    expect(extractAttendingYear("2027_onwards")).toBe("2027");
  });

  it("extracts year from 'fall_2025'", () => {
    expect(extractAttendingYear("fall_2025")).toBe("2025");
  });

  it("returns plain year string unchanged", () => {
    expect(extractAttendingYear("2024")).toBe("2024");
  });

  it("returns original string when no year found", () => {
    expect(extractAttendingYear("unknown")).toBe("unknown");
  });
});
