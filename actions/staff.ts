"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import qs from "qs";
import { api } from "@/lib/api";
import type {
  CreateStaffFormData,
  EditStaffFormData,
  StaffSearchParams,
} from "@/schemas/staff";
import type {
  ActionResponse,
  ActionResponseWithMessage,
  ActionResponseWithPagination,
  PaginatedResponse,
  SelectStaffs,
  Staff,
} from "@/types";

export async function getStaffList(
  params: StaffSearchParams,
): Promise<ActionResponseWithPagination<Staff[]>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const queryParams = qs.stringify(params, {
      skipNulls: true,
      addQueryPrefix: true,
    });

    const result = await api.get<PaginatedResponse<Staff>>(
      `/api/v1/users${queryParams}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: {
          tags: ["staff"],
        },
      },
    );

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch {
    return {
      success: false,
      error: "Không thể tải danh sách nhân viên",
    };
  }
}

export async function createStaff(
  data: CreateStaffFormData,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.post("/api/v1/users", data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // revalidatePath("/staff");
    revalidateTag("staff");

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

export async function getStaffById(
  staffId: string,
): Promise<ActionResponse<Staff>> {
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
): Promise<ActionResponseWithMessage> {
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

export async function deleteStaff(
  staffId: string,
): Promise<ActionResponseWithMessage> {
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

// Get all users for select dropdown
export async function getSelectStaffs(q?: string): Promise<SelectStaffs[]> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const searchQuery = qs.stringify(
      { q },
      { skipNulls: true, addQueryPrefix: true },
    );

    const result = await api.get<SelectStaffs[]>(
      `/api/v1/users/all/select${searchQuery}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    // Map to SelectUser format
    return result.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
