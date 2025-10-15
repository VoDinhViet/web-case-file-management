import { z } from "zod";

export const createStaffSchema = z.object({
  fullName: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được quá 100 ký tự"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(11, "Số điện thoại không được quá 11 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được quá 50 ký tự"),
});

// password không bắt buộc
export const editStaffSchema = z.object({
  fullName: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
});

export const staffSearchParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
  limit: z.coerce.number().int().positive().default(10).catch(10),
  q: z.string().optional().catch(undefined),
});

export type EditStaffFormData = z.infer<typeof editStaffSchema>;
export type CreateStaffFormData = z.infer<typeof createStaffSchema>;
export type StaffSearchParams = z.infer<typeof staffSearchParamsSchema>;
