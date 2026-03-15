import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ViewToggle from "./ViewToggle";

describe("ViewToggle", () => {
  it("renders Student Submissions and Analytics options", () => {
    render(<ViewToggle activeView="summary" onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /student submissions/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /analytics/i })).toBeInTheDocument();
  });

  it("calls onChange with 'detailed' when Student Submissions is clicked", async () => {
    const onChange = vi.fn();
    render(<ViewToggle activeView="summary" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: /student submissions/i }));
    expect(onChange).toHaveBeenCalledWith("detailed");
  });

  it("calls onChange with 'summary' when Summary is clicked", async () => {
    const onChange = vi.fn();
    render(<ViewToggle activeView="detailed" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: /analytics/i }));
    expect(onChange).toHaveBeenCalledWith("summary");
  });

  it("marks the active view as selected", () => {
    render(<ViewToggle activeView="detailed" onChange={vi.fn()} />);
    const submissionsBtn = screen.getByRole("button", { name: /student submissions/i });
    const summaryBtn = screen.getByRole("button", { name: /analytics/i });
    expect(submissionsBtn).toHaveAttribute("aria-pressed", "true");
    expect(summaryBtn).toHaveAttribute("aria-pressed", "false");
  });
});
