import { z } from "zod";

// Field schema
export const fieldSchema = z.object({
  fieldName: z.string().min(1, "Tên trường là bắt buộc"),
  fieldLabel: z.string().min(1, "Nhãn là bắt buộc"),
  placeholder: z.string().optional(),
  fieldType: z.enum(["text", "number", "select", "date", "textarea"]),
  isRequired: z.boolean(),
  description: z.string().optional(),
  fieldValue: z.unknown().optional(),
  index: z.number().int().min(0),
});

// Group schema
export const groupSchema = z.object({
  title: z.string().min(1, "Tiêu đề nhóm là bắt buộc"),
  description: z.string().optional(),
  index: z.number().int().min(0),
  fields: z.array(fieldSchema).min(1, "Nhóm phải có ít nhất 1 trường"),
});

// Template schema
export const createTemplateSchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(200, "Tiêu đề không được quá 200 ký tự"),
  description: z.string().optional(),
  groups: z.array(groupSchema).min(1, "Mẫu phải có ít nhất 1 nhóm"),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export const templateSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
  limit: z.coerce.number().int().positive().default(10).catch(10),
  q: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
});

export type FieldFormData = z.infer<typeof fieldSchema>;
export type GroupFormData = z.infer<typeof groupSchema>;
export type CreateTemplateFormData = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateFormData = z.infer<typeof updateTemplateSchema>;
export type TemplateSearchParams = z.infer<typeof templateSearchParamsSchema>;
