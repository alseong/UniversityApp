"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useNotifications } from "@/utils/commentHooks";
import { Notification } from "@/types/comments";
import { formatShortId, formatRelativeTime } from "@/utils/comments";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  userId: string | null;
};

const notificationLabel = (type: Notification["type"]): string => {
  switch (type) {
    case "comment_on_submission":
      return "commented on your submission";
    case "reply_to_comment":
      return "replied to your comment";
  }
};

export function NotificationBell({ userId }: Props) {
  const { notifications, unreadCount, markRead } = useNotifications(userId);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!userId) return null;

  const ariaLabel =
    unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={ariaLabel}
          className="relative p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No notifications yet.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.is_read) markRead(n.id);
                  setOpen(false);
                  router.push(`/submissions/${n.submission_id}`);
                }}
                className={`px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/50 ${
                  !n.is_read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                }`}
              >
                <p className="text-sm">
                  <span className="font-mono font-medium">
                    #{formatShortId(n.actor_id)}
                  </span>{" "}
                  {notificationLabel(n.type)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatRelativeTime(n.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
