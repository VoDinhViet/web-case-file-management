import { z } from "zod";
import type { Template } from "@/types/template";

export const createCaseSchema = (formElements: Template) => {
  const dynamicShape: Record<string, z.ZodTypeAny> = {};

  formElements.groups.forEach((group) => {
    group.fields.forEach((field) => {
      switch (field.fieldType) {
        case "number":
          dynamicShape[field.fieldName] = field.isRequired
            ? z
                .number({ message: `${field.fieldLabel} phải là số` })
                .min(0, { message: `${field.fieldLabel} phải ≥ 0` })
            : z
                .number({ message: `${field.fieldLabel} phải là số` })
                .min(0, { message: `${field.fieldLabel} phải ≥ 0` })
                .optional()
                .nullable();
          break;

        case "date":
          dynamicShape[field.fieldName] = field.isRequired
            ? z.date({ message: `${field.fieldLabel} không hợp lệ` })
            : z
                .date({ message: `${field.fieldLabel} không hợp lệ` })
                .optional()
                .nullable();
          break;

        case "text":
        case "textarea":
          dynamicShape[field.fieldName] = field.isRequired
            ? z
                .string()
                .trim()
                .min(1, { message: `${field.fieldLabel} là bắt buộc` })
            : z.string().trim().optional().nullable();
          break;

        default:
          dynamicShape[field.fieldName] = z
            .string()
            .trim()
            .optional()
            .nullable();
      }
    });
  });

  return z.object({
    name: z.string().trim().min(1, { message: "Tên vụ án là bắt buộc" }),
    description: z.string().trim().optional().nullable(),
    applicableLaw: z.string().trim().min(1, { message: "Điều là bắt buộc" }),
    userId: z.string().trim().min(1, { message: "Cán bộ thụ lý là bắt buộc" }),
    numberOfDefendants: z
      .number({ message: "Số bị can phải là số" })
      .min(1, { message: "Số bị can ≥ 1" }),
    crimeType: z
      .string()
      .trim()
      .min(1, { message: "Loại tội phạm là bắt buộc" }),
    startDate: z.date({ message: "Ngày khởi tố không hợp lệ" }),
    endDate: z
      .date({ message: "Ngày kết thúc không hợp lệ" })
      .optional()
      .nullable(),
    fields: z.object(dynamicShape),
  });
};
