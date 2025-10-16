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

    console.log("📝 Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.log("📝 Permission result:", permission);
    return permission;
  };

/**
 * Get FCM token for this device
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Check browser support first
    if (!isNotificationSupported()) {
      console.warn(
        "Browser does not support required features for push notifications",
      );
      return null;
    }

    const messaging = getFirebaseMessaging();
    if (!messaging) {
      console.warn(
        "Firebase Messaging is not available (browser not supported or initialization failed)",
      );
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
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

      if (!vapidKey) {
        console.error("VAPID key is not configured");
        return null;
      }

      // Register or get existing service worker
      let registration = await navigator.serviceWorker.getRegistration("/");

      if (!registration) {
        registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );
      }

      // Get FCM token immediately (getToken will wait for SW if needed)
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      return token;
    }

    return null;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    // Don't throw, just return null to gracefully handle unsupported browsers
    return null;
  }
};

/**
 * Send FCM token to backend using server action
 */
export const sendTokenToBackend = async (token: string): Promise<boolean> => {
  try {
    // Dynamically import to avoid circular dependencies
    const { registerFCMToken } = await import("@/actions/notification");

    const result = await registerFCMToken(token);

    if (!result.success) {
      console.error("Failed to register FCM token:", result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending FCM token to backend:", error);
    return false;
  }
};

/**
 * Setup foreground message listener
 */
export const onForegroundMessage = (
  callback: (payload: NotificationPayload) => void,
): (() => void) => {
  try {
    const messaging = getFirebaseMessaging();
    if (!messaging) {
      console.warn(
        "Firebase Messaging not available - foreground notifications disabled",
      );
      return () => {};
    }

    const unsubscribe = onMessage(messaging, (payload) => {
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
  } catch (error) {
    console.error("Error setting up foreground message listener:", error);
    return () => {};
  }
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
