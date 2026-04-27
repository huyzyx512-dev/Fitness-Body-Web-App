import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import workoutRoute from "./routes/workoutRoute.js";
import exerciseRoute from "./routes/exerciseRoute.js";
import workoutLogRoute from "./routes/workoutLogRoute.js";
import { authenticationToken } from "./middlewares/authMiddleware.js";
import { appConfig } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: appConfig.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/workouts", authenticationToken, workoutRoute);
app.use("/api/exercises", exerciseRoute);
app.use("/api/workout-logs", authenticationToken, workoutLogRoute);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
