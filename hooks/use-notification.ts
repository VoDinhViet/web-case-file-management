"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type NotificationPayload,
  onForegroundMessage,
} from "@/lib/utils/notification";

interface UseNotificationReturn {
  lastNotification: NotificationPayload | null;
  notifications: NotificationPayload[];
  clearNotifications: () => void;
}

/**
 * Hook to listen for foreground notifications
 */
export const useNotification = (): UseNotificationReturn => {
  const [lastNotification, setLastNotification] =
    useState<NotificationPayload | null>(null);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      setLastNotification(payload);
      setNotifications((prev) => [...prev, payload]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setLastNotification(null);
  }, []);

  return {
    lastNotification,
    notifications,
    clearNotifications,
  };
};
