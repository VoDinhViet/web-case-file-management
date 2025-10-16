"use server";

import { cookies } from "next/headers";
import qs from "qs";
import { api } from "@/lib/api";
import type {
  ActionResponse,
  ActionResponseWithMessage,
  ActionResponseWithPagination,
  PaginatedResponse,
} from "@/types";

// ===== TYPES =====

export interface Notification {
  id: string;
  title: string;
  body: string;
  type?: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSearchParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
}

// ===== REGISTER FCM TOKEN =====

/**
 * Register FCM token with backend
 */
export async function registerFCMToken(
  fcmToken: string,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!fcmToken) {
      return {
        success: false,
        error: "FCM token is required",
      };
    }

    await api.patch(
      `/api/v1/users/fcm-token`,
      { fcmToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return {
      success: true,
      message: "Đã đăng ký nhận thông báo",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể đăng ký nhận thông báo",
    };
  }
}

// ===== GET NOTIFICATIONS =====

/**
 * Get list of notifications
 */
export async function getNotifications(
  params: NotificationSearchParams = {},
): Promise<ActionResponseWithPagination<Notification[]>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const queryParams = qs.stringify(params, {
      skipNulls: true,
      addQueryPrefix: true,
    });

    const result = await api.get<PaginatedResponse<Notification>>(
      `/api/v1/notifications${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          tags: ["notifications"],
        },
      },
    );

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      success: false,
      error: "Không thể tải danh sách thông báo",
    };
  }
}

// ===== GET UNREAD COUNT =====

/**
 * Get count of unread notifications
 */
export async function getUnreadCount(): Promise<ActionResponse<number>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<{ count: number }>(
      `/api/v1/notifications/unread/count`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return {
      success: true,
      data: result.count,
    };
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return {
      success: false,
      data: 0,
    };
  }
}

// ===== MARK AS READ =====

/**
 * Mark a notification as read
 */
export async function markAsRead(
  notificationId: string,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.patch(
      `/api/v1/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return {
      success: true,
      message: "Đã đánh dấu đã đọc",
    };
  } catch {
    return {
      success: false,
      error: "Không thể đánh dấu đã đọc",
    };
  }
}

// ===== MARK ALL AS READ =====

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.patch(
      `/api/v1/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return {
      success: true,
      message: "Đã đánh dấu tất cả đã đọc",
    };
  } catch {
    return {
      success: false,
      error: "Không thể đánh dấu tất cả đã đọc",
    };
  }
}

// ===== DELETE NOTIFICATION =====

/**
 * Delete a notification
 */
export async function deleteNotification(
  notificationId: string,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/v1/notifications/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      message: "Đã xóa thông báo",
    };
  } catch {
    return {
      success: false,
      error: "Không thể xóa thông báo",
    };
  }
}

// ===== DELETE ALL NOTIFICATIONS =====

/**
 * Delete all notifications
 */
export async function deleteAllNotifications(): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/v1/notifications`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      success: true,
      message: "Đã xóa tất cả thông báo",
    };
  } catch {
    return {
      success: false,
      error: "Không thể xóa thông báo",
    };
  }
}
