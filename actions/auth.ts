"use server";

import { cookies } from "next/headers";
import { api } from "@/lib/api";
import type { LoginFormData } from "@/schemas/auth";
import type { Staff } from "@/types";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenExpires: number; // Timestamp in milliseconds
}

interface LoginResult {
  success: boolean;
  message: string;
  data: LoginResponse | null;
}

interface ApiError {
  status?: number;
  message?: string;
  details?: Array<{
    property: string;
    code: string;
    message: string;
  }>;
}

export async function login(rawData: LoginFormData): Promise<LoginResult> {
  try {
    const result = await api.post<LoginResponse>("/api/v1/auth/login", rawData);

    const cookieStore = await cookies();

    // tokenExpires from backend is already a timestamp (milliseconds)
    const expiryTime = result.tokenExpires;

    // Calculate maxAge in seconds for cookie
    const maxAgeSeconds = Math.floor((expiryTime - Date.now()) / 1000);

    cookieStore.set("access_token", result.accessToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: maxAgeSeconds,
    });

    cookieStore.set("refresh_token", result.refreshToken, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Store token expiry time for middleware
    cookieStore.set("token_expiry", expiryTime.toString(), {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: maxAgeSeconds,
    });

    return { success: true, message: "Đăng nhập thành công", data: result };
  } catch (error) {
    const apiError = error as ApiError;

    // Xử lý lỗi validation (422)
    if (apiError.status === 422 && apiError.details) {
      const messages = apiError.details.map((d) => d.message).join(", ");
      return { success: false, message: messages, data: null };
    }

    // Xử lý lỗi unauthorized (401)
    if (apiError.status === 401) {
      return {
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không đúng",
        data: null,
      };
    }

    return {
      success: false,
      message: apiError.message || "Đăng nhập thất bại. Vui lòng thử lại.",
      data: null,
    };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("token_expiry");

    return { success: true };
  } catch {
    return { success: false, error: "Đăng xuất thất bại" };
  }
}

export async function getCurrentUser(): Promise<{
  success: boolean;
  data: Staff | null;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return { success: false, data: null };
    }

    const staff = await api.get<Staff>("/api/v1/users/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { success: true, data: staff };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { success: false, data: null };
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  return !!token;
}
