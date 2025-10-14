import type { BaseEntity } from "./base";

export interface Phase extends BaseEntity {
  caseId: string;
  name: string;
  order: number;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  note?: string;
  isCompleted: boolean;
  tasks?: string[];
}

export interface CreatePhaseInput
  extends Omit<Phase, "id" | "createdAt" | "updatedAt"> {}

export interface UpdatePhaseInput extends Partial<CreatePhaseInput> {}
