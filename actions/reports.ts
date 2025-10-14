"use server";

import type { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";
import qs from "qs";
import { api } from "@/lib/api";
import type { CaseStatsResponse, StatusStats } from "@/types";
import { CaseStatusEnum } from "@/types";

api.setBaseUrl(process.env.NEXT_PUBLIC_API_URL || "");

interface GetCaseStatsParams {
  userId?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

export async function getCaseStats(
  params?: GetCaseStatsParams,
): Promise<StatusStats[]> {
  try {
    const queryString = qs.stringify(params, { skipNulls: true });
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const result = await api.get<CaseStatsResponse>(
      `/api/reports/case${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const total =
      result.pending +
      result.inProgress +
      result.completed +
      result.onHold +
      result.cancelled;

    const stats: StatusStats[] = [
      {
        status: CaseStatusEnum.PENDING,
        count: result.pending,
        percentage: total > 0 ? result.pending / total : 0,
        label: "Chưa xử lý",
      },
      {
        status: CaseStatusEnum.IN_PROGRESS,
        count: result.inProgress,
        percentage: total > 0 ? result.inProgress / total : 0,
        label: "Đang xử lý",
      },
      {
        status: CaseStatusEnum.COMPLETED,
        count: result.completed,
        percentage: total > 0 ? result.completed / total : 0,
        label: "Đã đóng",
      },
      {
        status: CaseStatusEnum.ON_HOLD,
        count: result.onHold,
        percentage: total > 0 ? result.onHold / total : 0,
        label: "Tạm hoãn",
      },
      {
        status: CaseStatusEnum.CANCELLED,
        count: result.cancelled,
        percentage: total > 0 ? result.cancelled / total : 0,
        label: "Hủy bỏ",
      },
    ];

    return stats;
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.statusCode === 401) {
      unauthorized();
    }
    throw error;
  }
}
