"use strict";

import dotenv from "dotenv";

dotenv.config();

const shared = {
  dialect: process.env.DB_DIALECT || "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
};

export default {
  development: {
    ...shared,
    database: process.env.DB_NAME || "fitness_tracker",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  },
  test: {
    ...shared,
    database: process.env.DB_TEST_NAME || "fitness_tracker_test",
    username: process.env.DB_TEST_USER || process.env.DB_USER || "root",
    password: process.env.DB_TEST_PASSWORD || process.env.DB_PASSWORD || "",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: process.env.DB_DIALECT || "mysql",
    dialectOptions:
      process.env.DB_SSL === "true" ? { ssl: { require: true } } : {},
  },
};
