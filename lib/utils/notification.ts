import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

export interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
  };
  data?: Record<string, string>;
}

/**
 * Request notification permission from user
 */
export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return "denied";
    }

    const permission = await Notification.requestPermission();
    return permission;
  };

/**
 * Get FCM token for this device
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messaging = getFirebaseMessaging();
    if (!messaging) {
      console.warn("Firebase Messaging is not available");
      return null;
    }

    // Request permission first
    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      // Register service worker
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );
      console.log("Service Worker registered:", registration);

      // Wait for service worker to be ready and active
      await navigator.serviceWorker.ready;
      console.log("Service Worker is ready");

      // Ensure service worker is active
      if (!registration.active) {
        console.log("Waiting for service worker to activate...");
        await new Promise<void>((resolve) => {
          const checkActive = () => {
            if (registration.active) {
              resolve();
            } else {
              setTimeout(checkActive, 100);
            }
          };
          checkActive();
        });
      }

      // Get FCM token
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      console.log(
        "VAPID Key:",
        vapidKey ? `${vapidKey.substring(0, 20)}...` : "NOT FOUND",
      );
      console.log("VAPID Key length:", vapidKey?.length);

      if (!vapidKey) {
        console.error("VAPID key is not configured");
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        console.log("✅ FCM Token received successfully!");
        console.log("FCM Token (full):", token);
        console.log("FCM Token (preview):", `${token.substring(0, 50)}...`);
        console.log("FCM Token length:", token.length);
      } else {
        console.warn("❌ No FCM token received");
      }

      return token;
    }

    return null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

/**
 * Send FCM token to backend using server action
 */
export const sendTokenToBackend = async (token: string): Promise<boolean> => {
  try {
    console.log("📤 Sending FCM token to backend...");

    // Dynamically import to avoid circular dependencies
    const { registerFCMToken } = await import("@/actions/notification");

    const result = await registerFCMToken(token);

    if (!result.success) {
      console.error("❌ Failed to register token:", result.error);
      return false;
    }

    console.log("✅ Token sent to backend successfully:", result.message);
    console.log("📊 Backend response data:", result.data);

    return true;
  } catch (error) {
    console.error("❌ Error sending token to backend:", error);
    return false;
  }
};

/**
 * Setup foreground message listener
 */
export const onForegroundMessage = (
  callback: (payload: NotificationPayload) => void,
): (() => void) => {
  const messaging = getFirebaseMessaging();
  if (!messaging) {
    return () => {};
  }

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    callback(payload as NotificationPayload);

    // Show notification even in foreground
    if (payload.notification) {
      const { title, body, icon } = payload.notification;
      if (Notification.permission === "granted") {
        new Notification(title || "Thông báo mới", {
          body: body || "",
          icon: icon || "/favicon.ico",
          badge: "/favicon.ico",
          tag: payload.data?.caseId || "notification",
          data: payload.data,
        });
      }
    }
  });

  return unsubscribe;
};

/**
 * Check if notifications are supported
 */
export const isNotificationSupported = (): boolean => {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
};

/**
 * Get current notification permission status
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (!("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
};
