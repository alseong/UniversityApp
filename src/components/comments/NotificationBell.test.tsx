import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationBell } from "./NotificationBell";
import { Notification } from "@/types/comments";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockMarkRead = vi.fn().mockResolvedValue({});

vi.mock("@/utils/commentHooks", () => ({
  useNotifications: vi.fn(),
}));

import { useNotifications } from "@/utils/commentHooks";
const mockUseNotifications = vi.mocked(useNotifications);

const makeNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: "n1",
  recipient_id: "user-me",
  actor_id: "aaaa-bbbb-cccc-001234",
  comment_id: "c1",
  submission_id: "sub-1",
  type: "comment_on_submission",
  is_read: false,
  created_at: new Date().toISOString(),
  ...overrides,
});

const makeHookReturn = (overrides = {}) => ({
  notifications: [] as Notification[],
  unreadCount: 0,
  markRead: mockMarkRead,
  ...overrides,
});

beforeEach(() => {
  mockUseNotifications.mockReturnValue(makeHookReturn());
  mockMarkRead.mockClear();
  mockPush.mockClear();
});

describe("NotificationBell", () => {
  it("renders nothing when userId is null", () => {
    const { container } = render(<NotificationBell userId={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders bell button when userId is provided", () => {
    render(<NotificationBell userId="user-1" />);
    expect(screen.getByRole("button", { name: /notifications/i })).toBeInTheDocument();
  });

  it("shows unread count badge when unread notifications exist", () => {
    mockUseNotifications.mockReturnValue(makeHookReturn({ unreadCount: 3 }));
    render(<NotificationBell userId="user-1" />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not show badge when no unread notifications", () => {
    render(<NotificationBell userId="user-1" />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("caps badge display at 9+", () => {
    mockUseNotifications.mockReturnValue(makeHookReturn({ unreadCount: 12 }));
    render(<NotificationBell userId="user-1" />);
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("button has accessible label with count when unread notifications exist", () => {
    mockUseNotifications.mockReturnValue(makeHookReturn({ unreadCount: 2 }));
    render(<NotificationBell userId="user-1" />);
    expect(screen.getByRole("button", { name: /2 unread/i })).toBeInTheDocument();
  });

  it("shows notification list when bell is clicked", async () => {
    const notifications = [makeNotification({ type: "comment_on_submission" })];
    mockUseNotifications.mockReturnValue(makeHookReturn({ notifications, unreadCount: 1 }));
    render(<NotificationBell userId="user-1" />);
    await userEvent.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.getByText(/commented on your submission/i)).toBeInTheDocument();
  });

  it("shows reply-to-comment label for reply notifications", async () => {
    const notifications = [makeNotification({ type: "reply_to_comment" })];
    mockUseNotifications.mockReturnValue(makeHookReturn({ notifications, unreadCount: 1 }));
    render(<NotificationBell userId="user-1" />);
    await userEvent.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.getByText(/replied to your comment/i)).toBeInTheDocument();
  });

  it("shows thread-reply label for new_reply_in_thread notifications", async () => {
    const notifications = [makeNotification({ type: "new_reply_in_thread" })];
    mockUseNotifications.mockReturnValue(makeHookReturn({ notifications, unreadCount: 1 }));
    render(<NotificationBell userId="user-1" />);
    await userEvent.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.getByText(/replied in a thread you're in/i)).toBeInTheDocument();
  });

  it("shows empty state when no notifications", async () => {
    render(<NotificationBell userId="user-1" />);
    await userEvent.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.getByText(/no notifications yet/i)).toBeInTheDocument();
  });

  it("shows actor short id in notification", async () => {
    const notifications = [makeNotification({ actor_id: "aaaa-bbbb-cccc-001234" })];
    mockUseNotifications.mockReturnValue(makeHookReturn({ notifications, unreadCount: 1 }));
    render(<NotificationBell userId="user-1" />);
    await userEvent.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.getByText(/#001234/i)).toBeInTheDocument();
  });

  it("calls markRead when an unread notification is clicked", async () => {
    const notifications = [makeNotification({ id: "n1", is_read: false })];
    mockUseNotifications.mockReturnValue(makeHookReturn({ notifications, unreadCount: 1 }));
    render(<NotificationBell userId="user-1" />);
    await userEvent.click(screen.getByRole("button", { name: /notifications/i }));
    await userEvent.click(screen.getByText(/commented on your submission/i));
    expect(mockMarkRead).toHaveBeenCalledWith("n1");
  });

  it("does not call markRead when an already-read notification is clicked", async () => {
    const notifications = [makeNotification({ id: "n1", is_read: true })];
    mockUseNotifications.mockReturnValue(makeHookReturn({ notifications, unreadCount: 0 }));
    render(<NotificationBell userId="user-1" />);
    await userEvent.click(screen.getByRole("button", { name: /notifications/i }));
    await userEvent.click(screen.getByText(/commented on your submission/i));
    expect(mockMarkRead).not.toHaveBeenCalled();
  });

  it("passes userId to useNotifications hook", () => {
    render(<NotificationBell userId="specific-user-id" />);
    expect(mockUseNotifications).toHaveBeenCalledWith("specific-user-id");
  });

  it("navigates to dashboard detailed view with submission id when notification is clicked", async () => {
    const notifications = [makeNotification({ submission_id: "sub-abc" })];
    mockUseNotifications.mockReturnValue(makeHookReturn({ notifications, unreadCount: 1 }));
    render(<NotificationBell userId="user-1" />);
    await userEvent.click(screen.getByRole("button", { name: /notifications/i }));
    await userEvent.click(screen.getByText(/commented on your submission/i));
    expect(mockPush).toHaveBeenCalledWith("/submissions/sub-abc");
  });
});
