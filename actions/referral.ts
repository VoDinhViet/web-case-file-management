"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { api } from "@/lib/api";
import type { ActionResponse, ActionResponseWithMessage } from "@/types";

interface ReferralCodeResponse {
  code: string;
  createdAt: string;
}

export async function getReferralCode(): Promise<ActionResponse<string>> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<ReferralCodeResponse>(
      "/api/v1/users/referral-code",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: {
          tags: ["referral-code"],
        },
      },
    );
    console.log("result", result);

    return { success: true, data: result.code };
  } catch {
    return { success: false, error: "Không thể lấy mã mời" };
  }
}

export async function regenerateReferralCode(): Promise<
  ActionResponseWithMessage<string>
> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    const result = await api.get<ReferralCodeResponse>(
      "/api/v1/users/referral-code/random",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    revalidateTag("referral-code");

    return {
      success: true,
      data: result.code,
      message: "Đã tạo mã mời mới thành công",
    };
  } catch {
    return { success: false, error: "Không thể tạo mã mời mới" };
  }
}
