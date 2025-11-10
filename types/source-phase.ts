import type { BaseEntity } from "./base";

export interface SourcePhase extends BaseEntity {
  sourceId: string;
  name: string;
  order: number;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  note?: string;
  isCompleted: boolean;
  completedAt?: Date | string;
  tasks?: string[];
}

export interface CreateSourcePhaseInput
  extends Omit<SourcePhase, "id" | "createdAt" | "updatedAt"> {}

export interface UpdateSourcePhaseInput
  extends Partial<CreateSourcePhaseInput> {}

