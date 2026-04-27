import { z } from "zod";
import { ValidationError } from "../errors/AppError.js";

export const positiveInt = (fieldName) =>
  z
    .number({ invalid_type_error: `${fieldName} phải là một số` })
    .int(`${fieldName} phải là số nguyên`)
    .positive(`${fieldName} phải lớn hơn 0`);

export const nonNegativeInt = (fieldName) =>
  z
    .number({ invalid_type_error: `${fieldName} phải là một số` })
    .int(`${fieldName} phải là số nguyên`)
    .min(0, `${fieldName} phải từ 0 trở lên`);

export const parseSchema = (schema, payload) => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    const [issue] = result.error.issues;
    throw new ValidationError(issue?.message || "Dữ liệu yêu cầu không hợp lệ", result.error.flatten());
  }

  return result.data;
};