import type { BaseEntity } from "./base";

export enum ActivityType {
  NOTE = "note",
  TASK = "task",
  STATUS_CHANGE = "status_change",
  ASSIGNMENT = "assignment",
  CREATED = "created",
  UPDATED = "updated",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Activity extends BaseEntity {
  caseId: string;
  type: ActivityType;
  title: string;
  description?: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, unknown>;
}

export interface Task extends BaseEntity {
  caseId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date | string;
  assignedUserId?: string;
  assignedUserName?: string;
  completedAt?: Date | string;
}

export interface Note extends BaseEntity {
  caseId: string;
  content: string;
  userId: string;
  userName?: string;
}

export interface CreateActivityInput
  extends Omit<Activity, "id" | "createdAt" | "updatedAt"> {}

export interface CreateTaskInput
  extends Omit<Task, "id" | "createdAt" | "updatedAt"> {}

export interface CreateNoteInput
  extends Omit<Note, "id" | "createdAt" | "updatedAt"> {}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

export interface UpdateNoteInput {
  content: string;
}
