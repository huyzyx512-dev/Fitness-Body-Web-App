import { AppError } from "../errors/AppError.js";

export const notFoundHandler = (req, res) => {
  return res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} không tìm thấy` });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  return res.status(500).json({
    message: "Lỗi hệ thống",
  });
};

