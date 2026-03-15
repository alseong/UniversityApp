import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommentInput } from "./CommentInput";

describe("CommentInput", () => {
  it("renders textarea and submit button", () => {
    render(<CommentInput onSubmit={vi.fn()} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /post/i })).toBeInTheDocument();
  });

  it("submit button is disabled when content is empty", () => {
    render(<CommentInput onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /post/i })).toBeDisabled();
  });

  it("submit button is enabled when content is not empty", async () => {
    render(<CommentInput onSubmit={vi.fn()} />);
    await userEvent.type(screen.getByRole("textbox"), "Hello");
    expect(screen.getByRole("button", { name: /post/i })).toBeEnabled();
  });

  it("calls onSubmit with trimmed content when valid", async () => {
    const onSubmit = vi.fn().mockResolvedValue({});
    render(<CommentInput onSubmit={onSubmit} />);
    await userEvent.type(screen.getByRole("textbox"), "  Hello world  ");
    await userEvent.click(screen.getByRole("button", { name: /post/i }));
    expect(onSubmit).toHaveBeenCalledWith("Hello world");
  });

  it("clears input after successful submission", async () => {
    const onSubmit = vi.fn().mockResolvedValue({});
    render(<CommentInput onSubmit={onSubmit} />);
    await userEvent.type(screen.getByRole("textbox"), "Hello");
    await userEvent.click(screen.getByRole("button", { name: /post/i }));
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("shows server error when onSubmit returns error", async () => {
    const onSubmit = vi.fn().mockResolvedValue({ error: "Something went wrong" });
    render(<CommentInput onSubmit={onSubmit} />);
    await userEvent.type(screen.getByRole("textbox"), "Hello");
    await userEvent.click(screen.getByRole("button", { name: /post/i }));
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("shows validation error for content over 1000 characters", async () => {
    render(<CommentInput onSubmit={vi.fn()} />);
    await userEvent.type(screen.getByRole("textbox"), "a".repeat(1001));
    await userEvent.click(screen.getByRole("button", { name: /post/i }));
    expect(screen.getByText(/1000 characters/i)).toBeInTheDocument();
  });

  it("shows cancel button when onCancel is provided", () => {
    render(<CommentInput onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onCancel when cancel button clicked", async () => {
    const onCancel = vi.fn();
    render(<CommentInput onSubmit={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("uses custom placeholder when provided", () => {
    render(<CommentInput onSubmit={vi.fn()} placeholder="Write a reply..." />);
    expect(screen.getByPlaceholderText("Write a reply...")).toBeInTheDocument();
  });

  it("uses custom submit label when provided", () => {
    render(<CommentInput onSubmit={vi.fn()} submitLabel="Reply" />);
    expect(screen.getByRole("button", { name: /reply/i })).toBeInTheDocument();
  });
});
