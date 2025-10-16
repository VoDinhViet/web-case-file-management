"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";

interface RegisterTokenResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

/**
 * Server Action to register FCM token with backend
 */
export async function registerFCMToken(
  fcmToken: string,
): Promise<RegisterTokenResponse> {
  try {
    console.log("🚀 [Server Action] Registering FCM token...");
    console.log("📱 FCM Token (preview):", fcmToken.substring(0, 50) + "...");
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!fcmToken) {
      console.error("❌ No FCM token provided");
      return {
        success: false,
        error: "FCM token is required",
      };
    }

    console.log("📡 Calling backend API: PUT /api/v1/users/fcm-token");

    const result = await api.patch(`/api/v1/users/fcm-token`, {
      fcmToken,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("✅ Backend response:", result);

    return {
      success: true,
      message: "FCM token registered successfully",
      data: result,
    };
  } catch (error) {
    console.error("❌ Error registering FCM token:", error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to register FCM token",
    };
  }
}
