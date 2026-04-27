import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ").trim().toLowerCase(),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  name: z.string().trim().min(3, "Tên phải có ít nhất 3 ký tự"),
  birthday: z.string().min(1, "Vui lòng nhập ngày sinh"),
  height: z.coerce.number().positive("Chiều cao phải lớn hơn 0"),
  weight: z.coerce.number().positive("Cân nặng phải lớn hơn 0"),
  gender: z.enum(["nam", "nữ", "khác"]).default("khác"),
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").trim().toLowerCase(),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});