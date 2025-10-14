import type { BaseEntity } from "./base";

export interface CaseField {
  id: string;
  fieldLabel?: string;
  fieldValue?: unknown;
  fieldType?: string;
}

export interface CaseGroup {
  id: string;
  title: string;
  description?: string;
  fields?: CaseField[];
}

export interface Case extends BaseEntity {
  name: string;
  applicableLaw?: string;
  userId?: string;
  numberOfDefendants?: number;
  crimeType?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  description?: string;
  customFields?: Record<string, unknown>;
  templateId?: string;
  status?: CaseStatus;
  priority?: CasePriority;
  groups?: CaseGroup[];
}

export interface CreateCaseInput
  extends Omit<Case, "id" | "createdAt" | "updatedAt"> {}

export interface UpdateCaseInput extends Partial<CreateCaseInput> {}

export enum CaseStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

export enum CaseStatusEnum {
  PENDING = "PENDING", // Chưa xử lý
  IN_PROGRESS = "IN_PROGRESS", // Đang xử lý
  COMPLETED = "COMPLETED", // Đã đóng
  ON_HOLD = "ON_HOLD", // Tạm hoãn
  CANCELLED = "CANCELLED", // Hủy bỏ
}

export enum CasePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface CaseStatsResponse {
  pending: number;
  inProgress: number;
  completed: number;
  onHold: number;
  cancelled: number;
}

export interface StatusStats {
  status: CaseStatusEnum;
  count: number;
  percentage: number;
  label: string;
}
