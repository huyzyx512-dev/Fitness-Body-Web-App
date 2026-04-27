import assert from "node:assert/strict";
import { buildRefreshTokenCookieOptions } from "../src/config/env.js";
import { parseSchema } from "../src/validators/common.js";
import { exerciseSchema } from "../src/validators/exerciseValidator.js";
import { registerSchema } from "../src/validators/authValidator.js";
import {
  WORKOUT_STATUS,
  assertCanCompleteWorkout,
  assertCanStartWorkout,
} from "../src/utils/workoutStatus.js";

const tests = [
  {
    name: "tùy chọn cookie bao gồm các trường bảo mật cơ bản",
    run: () => {
      const options = buildRefreshTokenCookieOptions(1000);
      assert.equal(options.httpOnly, true);
      assert.equal(options.maxAge, 1000);
      assert.equal(options.path, "/");
    },
  },
  {
    name: "schema đăng ký chuẩn hóa email",
    run: () => {
      const payload = parseSchema(registerSchema, {
        email: "USER@Example.COM",
        password: "123456",
        name: "Demo User",
        birthday: "2000-01-01",
        height: 170,
        weight: 70,
        gender: "khác", // Đã đổi thành "khác" để khớp với schema đã Việt hóa
      });

      assert.equal(payload.email, "user@example.com");
    },
  },
  {
    name: "schema bài tập yêu cầu payload đã được chuẩn hóa",
    run: () => {
      const payload = parseSchema(exerciseSchema, {
        name: "Bench Press",
        description: "Chest exercise",
        category_id: 1,
        muscle_group_ids: [1, 2],
        difficulty_level: "intermediate",
        equipment: "Barbell",
        met_value: 5,
        video_url: "https://example.com/video",
        thumbnail_url: "https://example.com/image",
      });

      assert.deepEqual(payload.muscle_group_ids, [1, 2]);
      assert.equal(payload.category_id, 1);
    },
  },
  {
    name: "bài tập đang chờ (pending) có thể bắt đầu",
    run: () => {
      assert.doesNotThrow(() => assertCanStartWorkout(WORKOUT_STATUS.PENDING));
    },
  },
  {
    name: "bài tập đang chờ (pending) không thể hoàn thành",
    run: () => {
      assert.throws(() => assertCanCompleteWorkout(WORKOUT_STATUS.PENDING));
    },
  },
  {
    name: "bài tập đang diễn ra (in progress) không thể bắt đầu hai lần",
    run: () => {
      assert.throws(() => assertCanStartWorkout(WORKOUT_STATUS.IN_PROGRESS));
    },
  },
];

let passed = 0;

for (const test of tests) {
  try {
    await test.run();
    passed += 1;
    console.log(`PASS: ${test.name}`);
  } catch (error) {
    console.error(`FAIL: ${test.name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

if (process.exitCode) {
  console.error(`${passed}/${tests.length} bài test đã vượt qua`);
} else {
  console.log(`${passed}/${tests.length} bài test đã vượt qua`);
}