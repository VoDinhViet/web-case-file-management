import { CaseStatusEnum } from "@/types";
import { z } from "zod";

// Case schema
export const createCaseSchema = z.object({
  name: z
    .string()
    .min(3, "Tên vụ án phải có ít nhất 3 ký tự")
    .max(200, "Tên vụ án không được quá 200 ký tự"),
  applicableLaw: z.string().optional(),
  userId: z.string().optional(),
  numberOfDefendants: z.coerce
    .number({ error: "Số bị can phải là số" })
    .int()
    .min(0, "Số bị can phải ≥ 0")
    .optional(),
  crimeType: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  description: z.string().optional(),
  // Custom fields from template
  customFields: z.record(z.string(), z.unknown()).optional(),
});

export const updateCaseSchema = createCaseSchema.partial();

export const caseSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
  limit: z.coerce.number().int().positive().default(10).catch(10),
  q: z.string().optional().catch(undefined),
  status: z.enum(CaseStatusEnum).optional().catch(undefined),
  userId: z.string().optional().catch(undefined),
});

export type CreateCaseFormData = z.infer<typeof createCaseSchema>;
export type UpdateCaseFormData = z.infer<typeof updateCaseSchema>;
export type CaseSearchParams = z.infer<typeof caseSearchParamsSchema>;
