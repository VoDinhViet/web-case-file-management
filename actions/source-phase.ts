"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { api } from "@/lib/api";
import type { CreatePhaseDto } from "@/schemas/phase";
import type { SourcePhase } from "@/types/source-phase";

export async function getSourcePhases(sourceId: string): Promise<{
  success: boolean;
  data?: SourcePhase[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<SourcePhase[]>(
      `/api/v1/sources/${sourceId}/phases`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: {
          tags: ["source-phases"],
        },
      },
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching source phases:", error);
    return {
      success: false,
      error: "Không thể tải giai đoạn của nguồn tin",
    };
  }
}

export async function addPhaseToSource({
  sourceId,
  rawData,
}: {
  sourceId: string;
  rawData: CreatePhaseDto;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.post(`/api/v1/sources/${sourceId}/phases`, rawData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("source-phases");

    return { success: true, message: "Tạo giai đoạn thành công" };
  } catch (error) {
    console.error("Error creating source phase:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Không thể tạo giai đoạn cho nguồn tin";
    return { success: false, error: errorMessage };
  }
}

export async function toggleSourcePhaseCompletion({
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
      `/api/v1/sources/phases/${phaseId}`,
      { isCompleted },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    revalidateTag("source-phases");

    return { success: true, message: "Cập nhật trạng thái thành công" };
  } catch (error) {
    console.error("Error toggling source phase:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Không thể cập nhật trạng thái giai đoạn";
    return { success: false, error: errorMessage };
  }
}

export async function updateSourcePhase({
  sourceId,
  phaseId,
  rawData,
}: {
  sourceId: string;
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

    await api.put(`/api/v1/sources/phases/${phaseId}`, rawData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("source-phases");
    revalidatePath(`/sources/${sourceId}`);

    return { success: true, message: "Cập nhật giai đoạn thành công" };
  } catch (error) {
    console.error("Error updating source phase:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Không thể cập nhật giai đoạn của nguồn tin";
    return { success: false, error: errorMessage };
  }
}

export async function deleteSourcePhase({
  sourceId,
  phaseId,
}: {
  sourceId: string;
  phaseId: string;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/v1/sources/phases/${phaseId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidateTag("source-phases");

    return { success: true, message: "Đã xóa giai đoạn thành công" };
  } catch (error) {
    console.error("Error deleting source phase:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Không thể xóa giai đoạn của nguồn tin";
    return { success: false, error: errorMessage };
  }
}

