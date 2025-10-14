"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { api } from "@/lib/api";
import type { CreateCaseFormData } from "@/schemas/case";
import type { Case, PaginatedResponse, Pagination } from "@/types";

export async function getCaseList(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string,
  userId?: string,
): Promise<{
  success: boolean;
  data?: Case[];
  pagination?: Pagination;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    let url = `/api/v1/cases?page=${page}&limit=${limit}`;
    if (search) {
      url += `&q=${encodeURIComponent(search)}`;
    }
    if (status && status !== "all") {
      url += `&status=${encodeURIComponent(status)}`;
    }
    if (userId) {
      url += `&userId=${encodeURIComponent(userId)}`;
    }

    const result = await api.get<PaginatedResponse<Case>>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    console.error("Error fetching case list:", error);
    return {
      success: false,
      error: "Không thể tải danh sách vụ án",
    };
  }
}

export async function getCaseById(caseId: string): Promise<{
  success: boolean;
  data?: Case;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<Case>(`/api/v1/cases/${caseId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching case:", error);
    return {
      success: false,
      error: "Không thể tải thông tin vụ án",
    };
  }
}

export async function createCase(
  data: CreateCaseFormData | Record<string, unknown>,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.post("/api/v1/cases", data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath("/cases");

    return { success: true, message: "Tạo vụ án thành công" };
  } catch (error) {
    console.error("Error creating case:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo vụ án";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function updateCase(
  caseId: string,
  data: Partial<CreateCaseFormData>,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(`/api/v1/cases/${caseId}`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath("/cases");
    revalidatePath(`/cases/${caseId}`);

    return { success: true, message: "Cập nhật vụ án thành công" };
  } catch (error) {
    console.error("Error updating case:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật vụ án";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function deleteCase(caseId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/v1/cases/${caseId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath("/cases");

    return { success: true, message: "Đã xóa vụ án thành công" };
  } catch (error) {
    console.error("Error deleting case:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể xóa vụ án";
    return { success: false, error: errorMessage };
  }
}
