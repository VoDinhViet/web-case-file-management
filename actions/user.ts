"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { api } from "@/lib/api";
import type { SelectStaffs } from "@/types";

// Get all users for select dropdown
export async function getSelectStaffs(): Promise<SelectStaffs[]> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<SelectStaffs[]>("/api/v1/users/all/select", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

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
