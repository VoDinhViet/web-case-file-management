"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import qs from "qs";
import { api } from "@/lib/api";
import type {
  CaseSearchParams,
  CreateCaseFormData,
  UpdateCaseFormData,
} from "@/schemas/case";
import type {
  ActionResponse,
  ActionResponseWithMessage,
  ActionResponseWithPagination,
  Case,
  CaseStatusEnum,
  PaginatedResponse,
} from "@/types";

export async function getCaseList(
  params: CaseSearchParams,
): Promise<ActionResponseWithPagination<Case[]>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const queryParams = qs.stringify(params, {
      skipNulls: true,
      addQueryPrefix: true,
    });

    const result = await api.get<PaginatedResponse<Case>>(
      `/api/v1/cases${queryParams}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: {
          tags: ["cases"],
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
      error: "Không thể tải danh sách vụ án",
    };
  }
}

export async function getCaseById(
  caseId: string,
): Promise<ActionResponse<Case>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<Case>(`/api/v1/cases/${caseId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { success: true, data: result };
  } catch {
    return { success: false, error: "Không thể tải thông tin vụ án" };
  }
}

export async function createCase(
  data: CreateCaseFormData | Record<string, unknown>,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.post("/api/v1/cases", data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("cases");

    return { success: true, message: "Tạo vụ án thành công" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo vụ án";
    return { success: false, error: errorMessage };
  }
}

export async function updateCase(
  caseId: string,
  data: UpdateCaseFormData,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(`/api/v1/cases/${caseId}`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("cases");

    return { success: true, message: "Cập nhật vụ án thành công" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật vụ án";
    return { success: false, error: errorMessage };
  }
}

export async function deleteCase(
  caseId: string,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/v1/cases/${caseId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("cases");

    return { success: true, message: "Đã xóa vụ án thành công" };
  } catch {
    return { success: false, error: "Không thể xóa vụ án" };
  }
}

export async function updateCaseStatus(
  caseId: string,
  status: CaseStatusEnum,
): Promise<ActionResponseWithMessage> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(
      `/api/v1/cases/${caseId}`,
      { status },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    revalidateTag("cases");

    return { success: true, message: "Cập nhật trạng thái thành công" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật trạng thái";
    return { success: false, error: errorMessage };
  }
}

export async function exportCaseReport(
  caseId: string,
  format: "pdf" | "docx",
): Promise<ActionResponse<Blob>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reports/export?caseId=${caseId}&format=${format}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Export failed");
    }

    const blob = await response.blob();
    return { success: true, data: blob };
  } catch (error) {
    console.error("Export error:", error);
    return { success: false, error: "Không thể xuất file" };
  }
}

export async function getCasePlan(caseId: string): Promise<
  ActionResponse<{
    investigationResult: string;
    exhibits: string[];
    nextInvestigationPurpose: string;
    nextInvestigationContent: string[];
    participatingForces: string[];
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
    }>(`/api/v1/cases/${caseId}/plan`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return { success: true, data: result };
  } catch {
    return {
      success: false,
      error: "Không thể tải kế hoạch",
      data: {
        investigationResult: "",
        exhibits: [],
        nextInvestigationPurpose: "",
        nextInvestigationContent: [],
        participatingForces: [],
      },
    };
  }
}

export async function updateCasePlan(
  caseId: string,
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

    await api.put(`/api/v1/cases/${caseId}/plan`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("cases");

    return { success: true, message: "Đã lưu kế hoạch thành công" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể lưu kế hoạch";
    return { success: false, error: errorMessage };
  }
}
