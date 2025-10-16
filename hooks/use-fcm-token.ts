"use client";

import { useEffect, useState } from "react";
import {
  getFCMToken,
  getNotificationPermission,
  isNotificationSupported,
  sendTokenToBackend,
} from "@/lib/utils/notification";

interface UseFCMTokenReturn {
  token: string | null;
  permission: NotificationPermission;
  isSupported: boolean;
  isLoading: boolean;
  error: Error | null;
  requestPermissionAndToken: () => Promise<void>;
}

/**
 * Hook to manage FCM token
 */
export const useFCMToken = (): UseFCMTokenReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported(isNotificationSupported());
    setPermission(getNotificationPermission());
  }, []);

  const requestPermissionAndToken = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fcmToken = await getFCMToken();
      console.log("fcmToken", fcmToken);

      if (fcmToken) {
        setToken(fcmToken);
        setPermission("granted");

        // Send token to backend
        const success = await sendTokenToBackend(fcmToken);
        if (!success) {
          console.warn("Failed to send token to backend");
        }
      } else {
        setPermission(getNotificationPermission());
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to get FCM token"),
      );
      console.error("Error in requestPermissionAndToken:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    token,
    permission,
    isSupported,
    isLoading,
    error,
    requestPermissionAndToken,
  };
};
