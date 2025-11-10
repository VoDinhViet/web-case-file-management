import { z } from "zod";
import { SourceStatusEnum } from "@/types";

// Source schema
export const createSourceSchema = z.object({
  name: z
    .string()
    .min(3, "Tên nguồn tin phải có ít nhất 3 ký tự")
    .max(200, "Tên nguồn tin không được quá 200 ký tự"),
  description: z.string().optional(),
  content: z.string().optional(),
  sourceType: z.string().optional(),
  // Custom fields from template
  customFields: z.record(z.string(), z.unknown()).optional(),
});

export const updateSourceSchema = createSourceSchema.partial();

export const sourceSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
  limit: z.coerce.number().int().positive().default(10).catch(10),
  q: z.string().optional().catch(undefined),
  status: z.nativeEnum(SourceStatusEnum).optional().catch(undefined),
  userId: z.string().optional().catch(undefined),
});

export type CreateSourceFormData = z.infer<typeof createSourceSchema>;
export type UpdateSourceFormData = z.infer<typeof updateSourceSchema>;
export type SourceSearchParams = z.infer<typeof sourceSearchParamsSchema>;

