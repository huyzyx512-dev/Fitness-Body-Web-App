'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // `Exercises.id` is INTEGER auto-increment (see migration), so do not provide `id` values here.
    // `createdAt/updatedAt` are NOT NULL in the migration, so we set them explicitly for bulkInsert.
    const now = new Date();

    await queryInterface.bulkInsert('Exercise', [
      {
        name: 'Bench Press',
        description: 'Bài tập đẩy ngực với tạ đòn, giúp phát triển cơ ngực và tay sau.',
        category: 'strength',
        muscle_group: 'chest',
        // Các trường mới thêm:
        met_value: 5.0, // Tập tạ nặng mức độ vừa phải
        difficulty_level: 'intermediate',
        equipment: 'Barbell, Bench',
        video_url: 'https://youtube.com/watch?v=benchpress_demo',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Squat',
        description: 'Bài tập gánh tạ, tác động lớn vào đùi và mông.',
        category: 'strength',
        muscle_group: 'legs',
        // Các trường mới thêm:
        met_value: 6.0, // Squat tốn nhiều năng lượng hơn Bench Press
        difficulty_level: 'advanced',
        equipment: 'Barbell, Rack',
        video_url: 'https://youtube.com/watch?v=squat_demo',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Treadmill Running',
        description: 'Chạy bộ trên máy tốc độ trung bình.',
        category: 'cardio',
        muscle_group: 'legs',
        // Cardio thường có MET cao hơn tập tạ
        met_value: 9.0,
        difficulty_level: 'beginner',
        equipment: 'Treadmill',
        video_url: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Yoga Basic Flow',
        description: 'Chuỗi bài tập Yoga giãn cơ cơ bản.',
        category: 'flexibility',
        muscle_group: 'full_body',
        // Yoga nhẹ nhàng có MET thấp
        met_value: 3.0,
        difficulty_level: 'beginner',
        equipment: 'Yoga Mat',
        video_url: null,
        createdAt: now,
        updatedAt: now,
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Exercise', null, {});
  },
};

