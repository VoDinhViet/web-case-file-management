"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
  type Notification,
  type NotificationSearchParams,
} from "@/actions/notification";
import { Pagination } from "@/types";

export function useNotificationsAPI() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    limit: 10,
    currentPage: 1,
    nextPage: false,
    previousPage: false,
    totalRecords: 0,
    totalPages: 0,
  });

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (params?: NotificationSearchParams) => {
      setLoading(true);
      try {
        const result = await getNotifications(params);
        if (result.success && result.data) {
          setNotifications(result.data);
          if (result.pagination) {
            setPagination(result.pagination);
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    const result = await getUnreadCount();
    if (result.success && result.data !== undefined) {
      setUnreadCount(result.data);
    }
  }, []);

  // Mark notification as read
  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      const result = await markAsRead(notificationId);
      if (result.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif,
          ),
        );
        // Refresh unread count
        fetchUnreadCount();
      } else {
        toast.error(result.error || "Không thể đánh dấu đã đọc");
      }
    },
    [fetchUnreadCount],
  );

  // Mark all as read
  const handleMarkAllAsRead = useCallback(async () => {
    const result = await markAllAsRead();
    if (result.success) {
      toast.success(result.message);
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
      setUnreadCount(0);
    } else {
      toast.error(result.error || "Không thể đánh dấu tất cả đã đọc");
    }
  }, []);

  // Delete notification
  const handleDeleteNotification = useCallback(
    async (notificationId: string) => {
      const result = await deleteNotification(notificationId);
      if (result.success) {
        toast.success(result.message);
        // Update local state
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== notificationId),
        );
        // Refresh unread count
        fetchUnreadCount();
      } else {
        toast.error(result.error || "Không thể xóa thông báo");
      }
    },
    [fetchUnreadCount],
  );

  // Delete all notifications
  const handleDeleteAllNotifications = useCallback(async () => {
    const result = await deleteAllNotifications();
    if (result.success) {
      toast.success(result.message);
      setNotifications([]);
      setUnreadCount(0);
    } else {
      toast.error(result.error || "Không thể xóa thông báo");
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    pagination,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    deleteAllNotifications: handleDeleteAllNotifications,
  };
}
