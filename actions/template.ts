"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { api } from "@/lib/api";
import type { CreateTemplateFormData } from "@/schemas/template";
import type {
  CaseTemplate,
  CreateTemplateActionResponse,
  PaginatedResponse,
  Pagination,
  UpdateTemplateActionProps,
  UpdateTemplateActionResponse,
} from "@/types";

export async function getTemplateList(
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: string,
): Promise<{
  success: boolean;
  data?: CaseTemplate[];
  pagination?: Pagination;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    let url = `/api/templates?page=${page}&limit=${limit}`;
    if (search) {
      url += `&q=${encodeURIComponent(search)}`;
    }
    if (category && category !== "all") {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const result = await api.get<PaginatedResponse<CaseTemplate>>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  } catch (error) {
    console.error("Error fetching template list:", error);
    return {
      success: false,
      error: "Không thể tải danh sách mẫu",
    };
  }
}

export async function getTemplateById(templateId: string): Promise<{
  success: boolean;
  data?: CaseTemplate;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<CaseTemplate>(`/api/templates/${templateId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("result", result);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching template:", error);
    return {
      success: false,
      error: "Không thể tải thông tin mẫu",
    };
  }
}

export async function createTemplate(
  data: CreateTemplateFormData,
): Promise<CreateTemplateActionResponse & { error?: string }> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.post("/api/templates", data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath("/templates");

    return { success: true, message: "Tạo mẫu thành công" };
  } catch (error) {
    console.error("Error creating template:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo mẫu";
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
}

export async function deleteTemplate(templateId: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/templates/${templateId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath("/templates");
    revalidatePath(`/templates/${templateId}`);

    return { success: true, message: "Đã xóa mẫu thành công" };
  } catch (error) {
    console.error("Error deleting template:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể xóa mẫu";
    return { success: false, error: errorMessage };
  }
}

export async function updateTemplate({
  templateId,
  rawData,
}: UpdateTemplateActionProps): Promise<
  UpdateTemplateActionResponse & { error?: string }
> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(`/api/templates/${templateId}`, rawData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath("/templates");
    revalidatePath(`/templates/${templateId}`);
    revalidatePath(`/templates/${templateId}/edit`);

    return { success: true, message: "Cập nhật mẫu thành công" };
  } catch (error) {
    console.error("Error updating template:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật mẫu";
    return {
      success: false,
      message: errorMessage,
      error: errorMessage,
    };
  }
}
