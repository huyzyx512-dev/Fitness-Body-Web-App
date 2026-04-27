import { ValidationError } from "../errors/AppError.js";

export const WORKOUT_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const assertCanStartWorkout = (status) => {
  if (status === WORKOUT_STATUS.COMPLETED) {
    throw new ValidationError("Bài tập đã hoàn thành");
  }

  if (status === WORKOUT_STATUS.IN_PROGRESS) {
    throw new ValidationError("Bài tập đang diễn ra");
  }
};

export const assertCanCompleteWorkout = (status) => {
  if (status === WORKOUT_STATUS.COMPLETED) {
    throw new ValidationError("Bài tập đã hoàn thành");
  }

  if (status === WORKOUT_STATUS.PENDING) {
    throw new ValidationError("Bài tập chưa được bắt đầu");
  }
};