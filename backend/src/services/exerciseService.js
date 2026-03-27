import db from '../models/index.js';
import z from 'zod';

const workoutExerciseSchema = z.object({
  // Bắt buộc phải là số nguyên (int), lớn hơn hoặc bằng 1
  sets: z.number({ required_error: "Thiếu số hiệp", invalid_type_error: "Số hiệp phải là một số" })
    .int("Số hiệp phải là số nguyên")
    .min(1, "Số hiệp phải lớn hơn 0"),

  reps: z.number({ required_error: "Thiếu số lần lặp", invalid_type_error: "Số lần lặp phải là một số" })
    .int("Số lần lặp phải là số nguyên")
    .min(1, "Số lần lặp phải lớn hơn 0"),

  // Cân nặng có thể có phần thập phân, có thể null hoặc không gửi lên (optional)
  weight: z.number({ invalid_type_error: "Trọng lượng phải là một số" })
    .nullable()
    .optional(),

  // Ghi chú là chuỗi, có thể bỏ qua
  comment: z.string({ invalid_type_error: "Ghi chú phải là chữ" })
    .optional(),

  order_index: z.number({ invalid_type_error: "Thứ tự bài tập phải là một số" })
    .int("Thứ tự bài tập phải là số nguyên")
    .min(0, "Thứ tự không được là số âm")
    .optional()
    .default(0), // Trùng khớp với DEFAULT '0' trong DB

  // THÊM MỚI: Thời gian nghỉ (giây)
  rest_time_seconds: z.number({ invalid_type_error: "Thời gian nghỉ phải là một số" })
    .int("Thời gian nghỉ phải là số nguyên")
    .min(0, "Thời gian nghỉ không được là số âm")
    .optional()
    .default(60), // Trùng khớp với DEFAULT '60' trong DB
})

export const getAllExercises = async () => {
  return await db.Exercise.findAll({
    order: [['name', 'ASC']]
  });
};

export const createNewExercise = async (name, description, category, muscle_group, userId) => {
  return await db.Exercise.create({
    name, description, category, muscle_group,
    created_by: userId
  });
};

export const updateInfoExercise = async (id, data, user) => {
  const exercise = await db.Exercise.findByPk(id);

  if (!exercise) {
    throw new Error('NOT_FOUND');
  }

  if (
    exercise.created_by !== user.id &&
    user.role.name !== 'ADMIN'
  ) {
    throw new Error('FORBIDDEN');
  }

  return await db.Exercise.update(data, {
    where: { id }
  });
};

export const deleteExerciseById = async (id, user) => {
  const exercise = await db.Exercise.findByPk(id);

  if (!exercise) {
    throw new Error('NOT_FOUND');
  }

  if (
    exercise.created_by !== user.id &&
    user.role.name !== 'ADMIN'
  ) {
    throw new Error('FORBIDDEN');
  }

  await db.Exercise.destroy({ where: { id: exercise.id } });
};

export const checkDataBeforeUse = async (user, params, data, isUpdate = false) => {
  const { workoutId, exerciseId } = params;

  const validationResult = workoutExerciseSchema.safeParse(data);

  if (!validationResult.success) {
    const firstErrorMessage = validationResult.error.errors[0].message;
    const error = new Error(firstErrorMessage);
    error.statusCode = 400;
    throw error;
  }

  const cleanData = validationResult.data;

  // 1. Kiểm tra Exercise có tồn tại không
  const exercise = await db.Exercise.findByPk(exerciseId);
  if (!exercise) {
    const error = new Error("Bài tập không tồn tại");
    error.statusCode = 404;
    throw error;
  }

  // 2. BẢO MẬT: Tìm Workout nhưng phải kèm theo điều kiện user_id là user hiện tại
  const workout = await db.Workout.findOne({
    where: {
      id: workoutId,
      user_id: user.id
    }
  });

  if (!workout) {
    const error = new Error("Workout không tồn tại hoặc bạn không có quyền sửa đổi");
    error.statusCode = 404; // Trả về 404 để hacker không biết là workout có tồn tại hay không
    throw error;
  }

  if (workout.status === 'completed') {
    const error = new Error("Buổi tập này đã hoàn thành");
    error.statusCode = 400;
    throw error;
  }

  // 3. Kiểm tra bài tập đã tồn tại trong workout chưa
  const existingWorkoutExercise = await db.WorkoutExercise.findOne({
    where: {
      workout_id: workout.id,
      exercise_id: exercise.id
    }
  });

  if (!isUpdate && existingWorkoutExercise) {
    const error = new Error("Bài tập đã tồn tại trong buổi tập này");
    error.statusCode = 400;
    throw error;
  }

  if (isUpdate && !existingWorkoutExercise) {
    // Nếu là chế độ Sửa, mà KHÔNG tìm thấy bài tập -> Lỗi không có data để update
    const error = new Error("Không tìm thấy bài tập trong buổi tập này để cập nhật");
    error.statusCode = 404;
    throw error;
  }

  return { workout, exercise, cleanData };
}

export const addExerciseToWorkoutById = async (user, params, data) => {
  const { workout, exercise, cleanData } = await checkDataBeforeUse(user, params, data, false);

  await db.WorkoutExercise.create({
    ...cleanData,
    workout_id: workout.id,
    exercise_id: exercise.id
  });

  return true;
};

export const updateExerciseToWorkoutById = async (user, params, data) => {
  const { workout, exercise, cleanData } = await checkDataBeforeUse(user, params, data, true);

  await db.WorkoutExercise.update(
    { ...cleanData },
    {
      where: {
        workout_id: workout.id,
        exercise_id: exercise.id
      }
    }
  );

  return true;
};


export const removeExerciseToWorkoutById = async (user, params) => {
  const { workoutId, workoutExerciseId } = params;

  // 1. Kiểm tra Exercise có tồn tại không
  const workoutExercise = await db.WorkoutExercise.findByPk(workoutExerciseId);
  if (!workoutExercise) {
    const error = new Error("Bài tập không tồn tại");
    error.statusCode = 404;
    throw error;
  }

  const workout = await db.Workout.findOne({
    where: {
      id: workoutId,
      user_id: user.id
    }
  });

  if (!workout) {
    const error = new Error("Workout không tồn tại hoặc bạn không có quyền sửa đổi");
    error.statusCode = 404; // Trả về 404 để hacker không biết là workout có tồn tại hay không
    throw error;
  }

  if (workout.status === 'completed') {
    const error = new Error("Buổi tập này đã hoàn thành");
    error.statusCode = 400;
    throw error;
  }

  await db.WorkoutExercise.destroy({
    where: {
      id: workoutExercise.id
    }
  });

  return true;
};

export const completeWorkoutByUser = async (user, workoutId, data) => {
  const transaction = await db.sequelize.transaction();
  //TODO: Sửa lại phần đánh dấu hoàn thành buổi tập, nếu bấm đánh dấu hoàn thành thì tạo record trong bảng WorkoutLog
  try {
    // 1. Lấy thông tin User chi tiết (để lấy weight, height mới nhất)
    // req.user thường chỉ chứa id từ token, nên query lại cho chắc chắn
    const userDetails = await db.User.findByPk(user.id, {
      attributes: ['id', 'weight', 'gender'],
      transaction
    });

    // 2. Lấy Workout kèm danh sách các bài tập (Exercises) để tính MET
    const workout = await db.Workout.findOne({
      where: { id: workoutId },
      include: [
        {
          model: db.WorkoutExercise,
          as: 'exercises', // Tên alias trong model relation
          include: [{
            model: db.Exercise,
            as: 'exercise',
            attributes: ['met_value', 'name'] // Chỉ lấy met_value
          }]
        }
      ],
      transaction
    });

    if (!workout) {
      const error = new Error("Workout không tồn tại");
      error.statusCode = 404;
      throw error;
    }

    if (workout.user_id !== user.id) { // Kiểm tra quyền sở hữu (dùng user_id thay vì created_by cho chuẩn với schema mới)
      const error = new Error("Bạn không có quyền chỉnh sửa workout này");
      error.statusCode = 403;
      throw error;
    }

    if (workout.status === 'completed') {
      const error = new Error("Workout này đã hoàn thành trước đó");
      error.statusCode = 400;
      throw error;
    }

    if (workout.status === 'pending') {
      const error = new Error("Workout này chưa được bắt đầu");
      error.statusCode = 400;
      throw error;
    }

    // // 3. Tính toán Duration (Phút)
    const endTime = new Date();
    let durationMinutes = 0;

    // // if (data.duration && !isNaN(data.duration)) {
    // //   // Case 1: Frontend gửi lên (chính xác nhất)
    // //   durationMinutes = parseFloat(data.duration);
    // // } else 
    if (workout.started_at) {
      // Case 2: Tính từ lúc bắt đầu (nếu DB có lưu started_at)
      const diffMs = endTime - new Date(workout.started_at);
      durationMinutes = Math.floor(diffMs / 60000);
    }

    // // 4. Tính toán Calories dựa trên Dữ liệu thật
    let caloriesBurned = 0;

    // // Bước 4a: Tính MET trung bình của cả buổi tập
    let totalMet = 0;
    let exerciseCount = 0;

    if (workout.exercises && workout.exercises.length > 0) {
      workout.exercises.forEach(we => {
        if (we.exercise && we.exercise.met_value) {
          totalMet += parseFloat(we.exercise.met_value);
          exerciseCount++;
        }
      });


      //   // Nếu không có bài tập hoặc bài tập chưa có MET, dùng giá trị mặc định (VD: 5.0 cho Moderate intensity)
      const averageMet = exerciseCount > 0 ? (totalMet / exerciseCount) : 5.0;

      //   // Bước 4b: Lấy cân nặng (mặc định 70kg nếu chưa cập nhật)
      const userWeight = userDetails.weight ? parseFloat(userDetails.weight) : 70;

      //   // Bước 4c: Áp dụng công thức
      if (durationMinutes > 0) {
        caloriesBurned = Math.round((durationMinutes * (averageMet * 3.5 * userWeight)) / 200);
      }
    }

    await workout.update({
      status: "completed",
      ended_at: endTime
    }, { transaction });

    // 2. Sau đó mới tạo Log
    const newLog = await db.WorkoutLog.create({
      workout_id: workout.id,
      completed_at: endTime,
      duration_minutes: durationMinutes,
      calories_burned: caloriesBurned,
      comment: data.comment || "",
    }, { transaction });

    await transaction.commit();

    return {
      workout_id: workout.id,
      duration: durationMinutes,
      calories: caloriesBurned,
      message: "Workout completed successfully"
    };

  } catch (error) {
    // Chỉ rollback nếu transaction chưa được commit hoặc rollback
    // Kiểm tra transaction tồn tại và chưa finished để tránh lỗi "rollback has been called"
    if (transaction && !transaction.finished) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        // Nếu rollback cũng lỗi (transaction đã finished), chỉ log và tiếp tục throw error gốc
        console.error('Transaction rollback error:', rollbackError);
      }
    }
    throw error;
  }
}

export const startWorkoutById = async (user, params) => {
  const { id } = params;

  // 1. Tìm bản ghi Workout
  const workout = await db.Workout.findOne({
    where: { id: id }
  });

  // 2. Kiểm tra tồn tại
  if (!workout) {
    const error = new Error("Bài tập không tồn tại");
    error.statusCode = 404;
    throw error;
  }

  // 3. Kiểm tra quyền sở hữu (Security)
  if (workout.user_id !== user.id) {
    const error = new Error("Bạn không có quyền thực hiện bài tập này");
    error.statusCode = 403;
    throw error;
  }

  // 4. Kiểm tra Logic trạng thái (State Validation)
  // Nếu đã hoàn thành -> Không cho bắt đầu lại
  if (workout.status === 'completed') {
    const error = new Error("Bài tập này đã kết thúc, không thể bắt đầu lại");
    error.statusCode = 400;
    throw error;
  }

  // Nếu đang tập -> Không cần update lại started_at (tránh reset thời gian tính giờ)
  if (workout.status === 'in_progress') {
    const error = new Error("Bài tập này đang diễn ra rồi");
    error.statusCode = 400; // Hoặc trả về 200 kèm message tùy UX
    throw error;
  }

  // 5. Cập nhật Database
  // Chuyển status sang 'in_progress' và lưu thời gian bắt đầu
  workout.status = 'in_progress';
  workout.started_at = new Date();

  const affectedRows = await workout.save();
  console.log(affectedRows);

  return workout;
};