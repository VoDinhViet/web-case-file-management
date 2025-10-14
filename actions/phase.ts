"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { api } from "@/lib/api";
import type { CreatePhaseDto } from "@/schemas/phase";
import type { Phase } from "@/types/phase";

export async function getCasePhases(caseId: string): Promise<{
  success: boolean;
  data?: Phase[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<Phase[]>(`/api/v1/cases/${caseId}/phases`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: {
        tags: ["phases"],
      },
    });
    console.log(result);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching phases:", error);
    return {
      success: false,
      error: "Không thể tải giai đoạn",
    };
  }
}

export async function addPhaseToCase({
  caseId,
  rawData,
}: {
  caseId: string;
  rawData: CreatePhaseDto;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    console.log("Raw data:", rawData);

    await api.post(`/api/v1/cases/${caseId}/phases`, rawData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("phases");

    return { success: true, message: "Tạo giai đoạn thành công" };
  } catch (error) {
    console.error("Error creating phase:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo giai đoạn";
    return { success: false, error: errorMessage };
  }
}

export async function togglePhaseCompletion({
  phaseId,
  isCompleted,
}: {
  phaseId: string;
  isCompleted: boolean;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(
      `/api/v1/cases/phases/${phaseId}`,
      { isCompleted },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    revalidateTag("phases");

    return { success: true, message: "Cập nhật trạng thái thành công" };
  } catch (error) {
    console.error("Error toggling phase:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật trạng thái";
    return { success: false, error: errorMessage };
  }
}

export async function updatePhase({
  caseId,
  phaseId,
  rawData,
}: {
  caseId: string;
  phaseId: string;
  rawData: Partial<CreatePhaseDto>;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(`/api/v1/cases/phases/${phaseId}`, rawData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("phases");
    revalidatePath(`/cases/${caseId}`);

    return { success: true, message: "Cập nhật giai đoạn thành công" };
  } catch (error) {
    console.error("Error updating phase:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật giai đoạn";
    return { success: false, error: errorMessage };
  }
}

export async function deletePhase({
  caseId,
  phaseId,
}: {
  caseId: string;
  phaseId: string;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/v1/cases/phases/${phaseId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("phases");
    revalidatePath(`/cases/${caseId}`);

    return { success: true, message: "Đã xóa giai đoạn thành công" };
  } catch (error) {
    console.error("Error deleting phase:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể xóa giai đoạn";
    return { success: false, error: errorMessage };
  }
}
