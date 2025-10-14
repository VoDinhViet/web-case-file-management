"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { api } from "@/lib/api";
import type {
  Activity,
  CreateNoteInput,
  CreateTaskInput,
  Note,
  Task,
  UpdateNoteInput,
  UpdateTaskInput,
} from "@/types";

// Get activities for a case
export async function getCaseActivities(caseId: string): Promise<{
  success: boolean;
  data?: Activity[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<Activity[]>(
      `/api/cases/${caseId}/activities`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return {
      success: false,
      error: "Không thể tải hoạt động",
    };
  }
}

// Get tasks for a case
export async function getCaseTasks(caseId: string): Promise<{
  success: boolean;
  data?: Task[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<Task[]>(`/api/cases/${caseId}/tasks`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      success: false,
      error: "Không thể tải công việc",
    };
  }
}

// Get notes for a case
export async function getCaseNotes(caseId: string): Promise<{
  success: boolean;
  data?: Note[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<Note[]>(`/api/cases/${caseId}/notes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return {
      success: false,
      error: "Không thể tải ghi chú",
    };
  }
}

// Create task
export async function createTask(data: CreateTaskInput): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.post(`/api/cases/${data.caseId}/tasks`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath(`/cases/${data.caseId}`);

    return { success: true, message: "Tạo công việc thành công" };
  } catch (error) {
    console.error("Error creating task:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo công việc";
    return { success: false, error: errorMessage };
  }
}

// Update task
export async function updateTask(
  taskId: string,
  caseId: string,
  data: UpdateTaskInput,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(`/api/cases/${caseId}/tasks/${taskId}`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath(`/cases/${caseId}`);

    return { success: true, message: "Cập nhật công việc thành công" };
  } catch (error) {
    console.error("Error updating task:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật công việc";
    return { success: false, error: errorMessage };
  }
}

// Delete task
export async function deleteTask(
  taskId: string,
  caseId: string,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/cases/${caseId}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath(`/cases/${caseId}`);

    return { success: true, message: "Đã xóa công việc thành công" };
  } catch (error) {
    console.error("Error deleting task:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể xóa công việc";
    return { success: false, error: errorMessage };
  }
}

// Create note
export async function createNote(data: CreateNoteInput): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.post(`/api/cases/${data.caseId}/notes`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath(`/cases/${data.caseId}`);

    return { success: true, message: "Tạo ghi chú thành công" };
  } catch (error) {
    console.error("Error creating note:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo ghi chú";
    return { success: false, error: errorMessage };
  }
}

// Update note
export async function updateNote(
  noteId: string,
  caseId: string,
  data: UpdateNoteInput,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.put(`/api/cases/${caseId}/notes/${noteId}`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath(`/cases/${caseId}`);

    return { success: true, message: "Cập nhật ghi chú thành công" };
  } catch (error) {
    console.error("Error updating note:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể cập nhật ghi chú";
    return { success: false, error: errorMessage };
  }
}

// Delete note
export async function deleteNote(
  noteId: string,
  caseId: string,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    await api.delete(`/api/cases/${caseId}/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    revalidatePath(`/cases/${caseId}`);

    return { success: true, message: "Đã xóa ghi chú thành công" };
  } catch (error) {
    console.error("Error deleting note:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Không thể xóa ghi chú";
    return { success: false, error: errorMessage };
  }
}
