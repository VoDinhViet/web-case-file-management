import type { BaseEntity } from "./base";

export interface SourceField {
  id: string;
  fieldLabel?: string;
  fieldValue?: unknown;
  fieldType?: string;
}

export interface SourceGroup {
  id: string;
  title: string;
  description?: string;
  fields?: SourceField[];
}

export enum SourceStatusEnum {
  PENDING = "PENDING", // Chưa xử lý
  IN_PROGRESS = "IN_PROGRESS", // Đang xử lý
  VERIFIED = "VERIFIED", // Đã xác minh
  REJECTED = "REJECTED", // Từ chối
  ARCHIVED = "ARCHIVED", // Lưu trữ
}

export interface Source extends BaseEntity {
  name: string;
  description?: string;
  applicableLaw?: string;
  userId?: string;
  numberOfDefendants?: number;
  crimeType?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  content?: string;
  sourceType?: string;
  status?: SourceStatusEnum;
  priority?: SourcePriority;
  customFields?: Record<string, unknown>;
  templateId?: string;
  groups?: SourceGroup[];
}

export interface CreateSourceInput
  extends Omit<Source, "id" | "createdAt" | "updatedAt"> {}

export interface UpdateSourceInput extends Partial<CreateSourceInput> {}

export enum SourcePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface SourceStatsResponse {
  pending: number;
  inProgress: number;
  verified: number;
  rejected: number;
  archived: number;
}

export interface SourceStatusStats {
  status: SourceStatusEnum;
  count: number;
  percentage: number;
  label: string;
}
