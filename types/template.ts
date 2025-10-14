import type { BaseEntity } from "./base";

export type FieldType = "text" | "number" | "select" | "date" | "textarea";

export interface Field extends BaseEntity {
  fieldName: string;
  fieldLabel: string;
  placeholder?: string;
  fieldType: FieldType;
  isRequired: boolean;
  description?: string;
  fieldValue?: unknown;
  index: number;
}

export interface CreateFieldInput
  extends Omit<Field, "id" | "createdAt" | "updatedAt"> {}

export interface Group extends BaseEntity {
  title: string;
  description?: string;
  index: number;
  fields: Field[];
}

export interface CreateGroupInput
  extends Omit<Group, "id" | "createdAt" | "updatedAt"> {}

export interface Template extends BaseEntity {
  title: string;
  description?: string;
  groups: Group[];
}

export interface CreateTemplateInput
  extends Omit<Template, "id" | "createdAt" | "updatedAt"> {}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {}

export interface UpdateTemplateActionProps {
  templateId: string;
  rawData: UpdateTemplateInput;
}

export interface UpdateTemplateActionResponse {
  success: boolean;
  message: string;
}

export interface CreateTemplateActionResponse {
  success: boolean;
  message: string;
}

// Legacy interface for compatibility
export interface CaseTemplate extends BaseEntity {
  title: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  usageCount?: number;
  groups: Group[];
}

export enum TemplateCategory {
  CIVIL = "civil",
  CRIMINAL = "criminal",
  ADMINISTRATIVE = "administrative",
  LABOR = "labor",
  OTHER = "other",
}
