import { z } from "zod";

export const createPhaseSchema = z.object({
  name: z.string().min(1, {
    message: "Tên giai đoạn là bắt buộc",
  }),
  order: z
    .number({
      message: "Thứ tự giai đoạn không hợp lệ",
    })
    .min(1, {
      message: "Thứ tự giai đoạn phải lớn hơn 0",
    }),
  description: z.string().max(500).optional(),
  startDate: z.date({
    message: "Ngày bắt đầu không hợp lệ",
  }),
  endDate: z.date({
    message: "Ngày kết thúc không hợp lệ",
  }),
  tasks: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Tên công việc là bắt buộc" }),
      }),
    )
    .optional(),
  note: z.string().max(1000).optional(),
  isCompleted: z.boolean(),
});

export type CreatePhaseDto = z.infer<typeof createPhaseSchema>;
