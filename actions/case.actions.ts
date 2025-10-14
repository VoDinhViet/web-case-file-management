"use server";

import { revalidatePath } from "next/cache";
import { Case, CasePriority, CaseStatus } from "@/types";

// Create a new case
export async function createCase(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = (formData.get("status") as CaseStatus) || CaseStatus.OPEN;
    const priority =
      (formData.get("priority") as CasePriority) || CasePriority.MEDIUM;
    const assignedTo = formData.get("assignedTo") as string | undefined;

    // TODO: Replace with actual API call or database operation
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cases`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          assignedTo,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create case");
    }

    const newCase = await response.json();

    revalidatePath("/cases");
    revalidatePath("/dashboard");

    return { success: true, data: newCase };
  } catch (error) {
    console.error("Error creating case:", error);
    return { success: false, error: "Failed to create case" };
  }
}

// Update an existing case
export async function updateCase(caseId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as CaseStatus;
    const priority = formData.get("priority") as CasePriority;
    const assignedTo = formData.get("assignedTo") as string | undefined;

    // TODO: Replace with actual API call or database operation
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cases/${caseId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
          assignedTo,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update case");
    }

    const updatedCase = await response.json();

    revalidatePath("/cases");
    revalidatePath(`/cases/${caseId}`);
    revalidatePath("/dashboard");

    return { success: true, data: updatedCase };
  } catch (error) {
    console.error("Error updating case:", error);
    return { success: false, error: "Failed to update case" };
  }
}

// Delete a case
export async function deleteCase(caseId: string) {
  try {
    // TODO: Replace with actual API call or database operation
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cases/${caseId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete case");
    }

    revalidatePath("/cases");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting case:", error);
    return { success: false, error: "Failed to delete case" };
  }
}

// Update case status
export async function updateCaseStatus(caseId: string, status: CaseStatus) {
  try {
    // TODO: Replace with actual API call or database operation
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cases/${caseId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update case status");
    }

    const updatedCase = await response.json();

    revalidatePath("/cases");
    revalidatePath(`/cases/${caseId}`);
    revalidatePath("/dashboard");

    return { success: true, data: updatedCase };
  } catch (error) {
    console.error("Error updating case status:", error);
    return { success: false, error: "Failed to update case status" };
  }
}

// Assign case to user
export async function assignCase(caseId: string, userId: string) {
  try {
    // TODO: Replace with actual API call or database operation
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cases/${caseId}/assign`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignedTo: userId }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to assign case");
    }

    const updatedCase = await response.json();

    revalidatePath("/cases");
    revalidatePath(`/cases/${caseId}`);
    revalidatePath("/dashboard");

    return { success: true, data: updatedCase };
  } catch (error) {
    console.error("Error assigning case:", error);
    return { success: false, error: "Failed to assign case" };
  }
}
