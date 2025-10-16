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

// Cache token globally to avoid multiple fetches
let cachedToken: string | null = null;
let isFetching = false;

// LocalStorage keys
const FCM_TOKEN_KEY = "fcm_token";
const FCM_TOKEN_SENT_KEY = "fcm_token_sent";

/**
 * Hook to manage FCM token
 */
export const useFCMToken = (): UseFCMTokenReturn => {
  // Try to load from localStorage first
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(FCM_TOKEN_KEY);
      if (stored) {
        cachedToken = stored;
        return stored;
      }
    }
    return cachedToken;
  });

  // Initialize permission from browser state
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== "undefined") {
      return getNotificationPermission();
    }
    return "default";
  });

  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    const supported = isNotificationSupported();
    setIsSupported(supported);

    const currentPermission = getNotificationPermission();
    setPermission(currentPermission);

    // If we have cached token, check if we need to send to backend
    if (cachedToken && currentPermission === "granted") {
      const tokenSent = localStorage.getItem(FCM_TOKEN_SENT_KEY);
      if (!tokenSent || tokenSent !== cachedToken) {
        // Send token if not sent before or token changed
        const tokenToSend = cachedToken;
        sendTokenToBackend(tokenToSend)
          .then(() => {
            localStorage.setItem(FCM_TOKEN_SENT_KEY, tokenToSend);
          })
          .catch(console.error);
      }
    }

    // Auto-fetch token if supported and permission granted but no cache
    if (
      supported &&
      currentPermission === "granted" &&
      !cachedToken &&
      !isFetching
    ) {
      isFetching = true;
      getFCMToken()
        .then((fcmToken) => {
          if (fcmToken) {
            cachedToken = fcmToken;
            localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
            setToken(fcmToken);
            setPermission("granted");

            // Send to backend and mark as sent
            sendTokenToBackend(fcmToken)
              .then(() => {
                localStorage.setItem(FCM_TOKEN_SENT_KEY, fcmToken);
              })
              .catch(console.error);
          }
        })
        .catch((err) => {
          console.error("Auto-fetch FCM token failed:", err);
        })
        .finally(() => {
          isFetching = false;
        });
    }
  }, []);

  const requestPermissionAndToken = async () => {
    // Check current permission
    const currentPermission = getNotificationPermission();

    // If already granted and have token, just return
    if (currentPermission === "granted" && cachedToken) {
      setToken(cachedToken);
      setPermission("granted");
      return;
    }

    // Prevent multiple concurrent fetches
    if (isFetching) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      isFetching = true;

      // This will request permission from user
      const fcmToken = await getFCMToken();

      if (fcmToken) {
        cachedToken = fcmToken;
        localStorage.setItem(FCM_TOKEN_KEY, fcmToken);
        setToken(fcmToken);
        setPermission("granted");

        // Send token to backend and mark as sent
        sendTokenToBackend(fcmToken)
          .then(() => {
            localStorage.setItem(FCM_TOKEN_SENT_KEY, fcmToken);
          })
          .catch(console.error);
      } else {
        setPermission(getNotificationPermission());
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to get FCM token"),
      );
    } finally {
      setIsLoading(false);
      isFetching = false;
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

/**
 * Clear FCM token from cache (useful on logout)
 */
export const clearFCMCache = () => {
  cachedToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(FCM_TOKEN_KEY);
    localStorage.removeItem(FCM_TOKEN_SENT_KEY);
  }
};
