"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { api } from "@/lib/api";
import type { CreateStaffFormData, EditStaffFormData } from "@/schemas/staff";
import type { PaginatedResponse, Pagination, Staff } from "@/types";

export async function getStaffList(
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<{
  success: boolean;
  data?: Staff[];
  pagination?: Pagination;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    let url = `/api/v1/users?page=${page}&limit=${limit}`;
    if (search) {
      url += `&q=${encodeURIComponent(search)}`;
    }
  
  
    const result = await api.get<PaginatedResponse<Staff>>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
  
    return {
      success: false,
      error: "Không thể tải danh sách nhân viên",
    };
  }
}

export async function createStaff(data: CreateStaffFormData): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.post("/api/v1/users", data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath("/staff");

    return { success: true, message: "Thêm nhân viên thành công" };
  } catch (error) {
    console.error("Error creating staff:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể thêm nhân viên";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function getStaffById(staffId: string): Promise<{
  success: boolean;
  data?: Staff;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<Staff>(`/api/v1/users/${staffId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching staff:", error);
    return { success: false, error: "Không thể tải thông tin nhân viên" };
  }
}

export async function updateStaff(
  staffId: string,
  data: EditStaffFormData,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(`/api/v1/users/${staffId}`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath("/staff");

    return { success: true, message: "Cập nhật nhân viên thành công" };
  } catch (error) {
    console.error("Error updating staff:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật nhân viên";
    return { success: false, error: errorMessage };
  }
}

export async function deleteStaff(staffId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/v1/users/${staffId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath("/staff");

    return { success: true, message: "Đã xóa nhân viên thành công" };
  } catch {
    return { success: false, error: "Không thể xóa nhân viên" };
  }
}
