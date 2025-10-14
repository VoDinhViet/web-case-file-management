"use server";

import { api } from "@/lib/api";
import type { RegisterFormData } from "@/schemas/auth";

api.setBaseUrl(process.env.NEXT_PUBLIC_API_URL || "");

interface RegisterResponse {
  id: string;
  fullName: string;
  phone: string;
}

interface RegisterResult {
  success: boolean;
  message?: string;
}

export async function register(
  rawData: RegisterFormData,
): Promise<RegisterResult> {
  try {
    const { confirmPassword: _confirmPassword, ...registerData } = rawData;

    const response = await api.post<RegisterResponse>(
      "/api/v1/auth/register",
      registerData,
    );

    if (response) {
      return {
        success: true,
        message: "Đăng ký thành công! Vui lòng đăng nhập.",
      };
    }

    return {
      success: false,
      message: "Đăng ký thất bại",
    };
  } catch (error) {
    console.error("Register error:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        apiError.response?.data?.message || "Đăng ký thất bại";
      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: false,
      message: "Đã xảy ra lỗi. Vui lòng thử lại.",
    };
  }
}
