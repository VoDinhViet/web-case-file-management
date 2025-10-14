import { z } from "zod";

export const authReqSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormData = z.infer<typeof authReqSchema>;

export const registerReqSchema = z
  .object({
    fullName: z.string().min(1, "Họ và tên không được để trống"),
    phone: z
      .string()
      .min(10, "Số điện thoại không hợp lệ")
      .max(15, "Số điện thoại không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z
      .string()
      .min(6, "Mật khẩu xác nhận phải có ít nhất 6 ký tự"),
    //mã mời bắt buộc
    referralCode: z.string().min(1, "Mã mời không được để trống")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerReqSchema>;
