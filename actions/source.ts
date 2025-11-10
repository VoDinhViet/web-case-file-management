"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import qs from "qs";
import { api } from "@/lib/api";
import type {
  CreateSourceFormData,
  SourceSearchParams,
  UpdateSourceFormData,
} from "@/schemas/source";
import type {
  ActionResponse,
  ActionResponseWithMessage,
  ActionResponseWithPagination,
  PaginatedResponse,
  Source,
  SourceStatusEnum,
} from "@/types";

export async function getSourceList(
  params: SourceSearchParams,
): Promise<ActionResponseWithPagination<Source[]>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const queryParams = qs.stringify(params, {
      skipNulls: true,
      addQueryPrefix: true,
    });

    const result = await api.get<PaginatedResponse<Source>>(
      `/api/v1/sources${queryParams}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: {
          tags: ["sources"],
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
      error: "Không thể tải danh sách nguồn tin",
    };
  }
}

export async function getSourceById(
  sourceId: string,
): Promise<ActionResponse<Source>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<Source>(`/api/v1/sources/${sourceId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { success: true, data: result };
  } catch {
    return { success: false, error: "Không thể tải thông tin nguồn tin" };
  }
}

export async function createSource(
  data: CreateSourceFormData | Record<string, unknown>,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.post("/api/v1/sources", data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("sources");

    return { success: true, message: "Tạo nguồn tin thành công" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo nguồn tin";
    return { success: false, error: errorMessage };
  }
}

export async function updateSource(
  sourceId: string,
  data: UpdateSourceFormData,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(`/api/v1/sources/${sourceId}`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("sources");

    return { success: true, message: "Cập nhật nguồn tin thành công" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật nguồn tin";
    return { success: false, error: errorMessage };
  }
}

export async function deleteSource(
  sourceId: string,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/v1/sources/${sourceId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("sources");

    return { success: true, message: "Đã xóa nguồn tin thành công" };
  } catch {
    return { success: false, error: "Không thể xóa nguồn tin" };
  }
}

export async function updateSourceStatus(
  sourceId: string,
  status: SourceStatusEnum,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(
      `/api/v1/sources/${sourceId}`,
      { status },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    revalidateTag("sources");

    return { success: true, message: "Cập nhật trạng thái thành công" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật trạng thái";
    return { success: false, error: errorMessage };
  }
}

export async function exportSourceReport(
  sourceId: string,
  format: "pdf" | "docx",
): Promise<ActionResponse<Blob>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const query = new URLSearchParams({
      sourceId,
      format,
    }).toString();

    const endpoint = baseUrl
      ? `${baseUrl}/api/source/export?${query}`
      : `/api/source/export?${query}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Export failed");
    }

    const blob = await response.blob();
    return { success: true, data: blob };
  } catch (error) {
    console.error("Export source report error:", error);
    return { success: false, error: "Không thể xuất file" };
  }
}

export async function getSourcePlan(sourceId: string): Promise<
  ActionResponse<{
    investigationResult: string;
    exhibits: string[];
    nextInvestigationPurpose: string;
    nextInvestigationContent: string[];
    participatingForces: string[];
    startDate?: Date | string;
    endDate?: Date | string;
    budget: string;
  }>
> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<{
      investigationResult: string;
      exhibits: string[];
      nextInvestigationPurpose: string;
      nextInvestigationContent: string[];
      participatingForces: string[];
      startDate?: Date | string;
      endDate?: Date | string;
      budget: string;
    }>(`/api/v1/sources/${sourceId}/plan`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: {
        tags: ["source-plan"],
      },
    });

    return { success: true, data: result };
  } catch {
    return {
      success: false,
      error: "Không thể tải kế hoạch nguồn tin",
      data: {
        investigationResult: "",
        exhibits: [],
        nextInvestigationPurpose: "",
        nextInvestigationContent: [],
        participatingForces: [],
        startDate: undefined,
        endDate: undefined,
        budget: "",
      },
    };
  }
}

export async function updateSourcePlan(
  sourceId: string,
  data: {
    investigationResult: string;
    exhibits: string[];
    nextInvestigationPurpose: string;
    nextInvestigationContent: string[];
    participatingForces: string[];
    startDate?: Date;
    endDate?: Date;
    budget: string;
  },
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(`/api/v1/sources/${sourceId}/plan`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("sources");
    revalidateTag("source-plan");

    return { success: true, message: "Đã lưu kế hoạch nguồn tin thành công" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể lưu kế hoạch";
    return { success: false, error: errorMessage };
  }
}
