"use client";

import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationsAPI } from "@/hooks/use-notifications-api";
import { cn } from "@/lib/utils";

export function NotificationList() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationsAPI();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Thông báo</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {unreadCount} mới
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={markAllAsRead}
                title="Đánh dấu tất cả đã đọc"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Đang tải...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Không có thông báo nào
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                // biome-ignore lint/a11y/useSemanticElements: Need div to avoid nested button error with Button components inside
                <div
                  key={notification.id}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "group relative p-4 hover:bg-muted/50 transition-colors cursor-pointer w-full text-left",
                    !notification.isRead && "bg-primary/5",
                  )}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                    // Handle navigation if URL exists
                    if (notification.data?.url) {
                      window.location.href = notification.data.url as string;
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                      if (notification.data?.url) {
                        window.location.href = notification.data.url as string;
                      }
                    }
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={cn(
                            "text-sm leading-tight",
                            !notification.isRead && "font-semibold",
                          )}
                        >
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.body}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          title="Đánh dấu đã đọc"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        title="Xóa"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm"
                onClick={() => {
                  window.location.href = "/notifications";
                }}
              >
                Xem tất cả thông báo
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
