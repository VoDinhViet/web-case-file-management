"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import qs from "qs";
import { api } from "@/lib/api";
import type {
  CreateTemplateFormData,
  TemplateSearchParams,
} from "@/schemas/template";
import type {
  ActionResponse,
  ActionResponseWithMessage,
  ActionResponseWithPagination,
  CaseTemplate,
  PaginatedResponse,
  UpdateTemplateActionProps,
} from "@/types";

export async function getTemplateList(
  params: TemplateSearchParams,
): Promise<ActionResponseWithPagination<CaseTemplate[]>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const queryParams = qs.stringify(params, {
      skipNulls: true,
      addQueryPrefix: true,
    });

    const result = await api.get<PaginatedResponse<CaseTemplate>>(
      `/api/templates${queryParams}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: {
          tags: ["templates"],
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
      error: "Không thể tải danh sách mẫu",
    };
  }
}

export async function getTemplateById(
  templateId: string,
): Promise<ActionResponse<CaseTemplate>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<CaseTemplate>(`/api/templates/${templateId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { success: true, data: result };
  } catch {
    return { success: false, error: "Không thể tải thông tin mẫu" };
  }
}

export async function createTemplate(
  data: CreateTemplateFormData,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.post("/api/templates", data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("templates");

    return { success: true, message: "Tạo mẫu thành công" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo mẫu";
    return { success: false, error: errorMessage };
  }
}

export async function deleteTemplate(
  templateId: string,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/templates/${templateId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("templates");

    return { success: true, message: "Đã xóa mẫu thành công" };
  } catch {
    return { success: false, error: "Không thể xóa mẫu" };
  }
}

export async function updateTemplate({
  templateId,
  rawData,
}: UpdateTemplateActionProps): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(`/api/templates/${templateId}`, rawData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("templates");

    return { success: true, message: "Cập nhật mẫu thành công" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật mẫu";
    return { success: false, error: errorMessage };
  }
}
