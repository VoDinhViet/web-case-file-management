"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useFCMToken } from "@/hooks/use-fcm-token";
import { useNotification } from "@/hooks/use-notification";

interface NotificationProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component to handle FCM notifications
 * Add this to your root layout
 */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const { lastNotification } = useNotification();
  const { isSupported } = useFCMToken();

  useEffect(() => {
    if (!isSupported) {
      console.warn("Push notifications are not supported in this browser");
    }
  }, [isSupported]);

  // Show toast when new notification arrives in foreground
  useEffect(() => {
    if (lastNotification?.notification) {
      const { title, body } = lastNotification.notification;

      toast(title || "Thông báo mới", {
        description: body,
        duration: 5000,
        action: lastNotification.data?.url
          ? {
              label: "Xem",
              onClick: () => {
                if (lastNotification.data?.url) {
                  window.location.href = lastNotification.data.url;
                }
              },
            }
          : undefined,
      });
    }
  }, [lastNotification]);

  return <>{children}</>;
}
