import { z } from "zod";
import { nonNegativeInt, positiveInt } from "./common.js";

export const exerciseSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên bài tập"),
  description: z.string().trim().min(1, "Vui lòng nhập mô tả bài tập"),
  category_id: positiveInt("category_id"),
  muscle_group_ids: z
    .array(positiveInt("muscle_group_id"))
    .min(1, "Vui lòng chọn ít nhất một nhóm cơ"),
  difficulty_level: z.enum(["cơ bản", "trung bình", "nâng cao"]).default("cơ bản"),
  equipment: z.string().trim().min(1, "Vui lòng nhập tên dụng cụ").default("không"),
  met_value: z.coerce.number().positive("Giá trị MET phải lớn hơn 0").default(3),
  video_url: z.string().trim().url("Đường dẫn video không hợp lệ").nullable().optional(),
  thumbnail_url: z.string().trim().url("Đường dẫn hình thu nhỏ không hợp lệ").nullable().optional(),
});

export const exerciseUpdateSchema = exerciseSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  { message: "Vui lòng cập nhật ít nhất một thông tin" },
);

export const workoutExerciseSchema = z.object({
  sets: positiveInt("sets"),
  reps: positiveInt("reps"),
  weight: z.coerce.number().min(0, "Mức tạ phải từ 0 trở lên").nullable().optional(),
  comment: z.string().trim().max(1000, "Bình luận không được vượt quá 1000 ký tự").optional(),
  order_index: nonNegativeInt("order_index").default(0),
  rest_time_seconds: nonNegativeInt("rest_time_seconds").default(60),
});