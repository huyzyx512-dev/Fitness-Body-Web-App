import express from "express"
import cors from "cors"
import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"
import workoutRoute from "./routes/workoutRoute.js"
import { authenticationToken } from "./middlewares/authMiddleware.js"
import cookieParser from "cookie-parser"

const app = express()

// Define URL-encoded bodies
app.use(express.urlencoded({extended: false}))
// Parse JSON body
app.use(express.json())
app.use(cookieParser()); // Lấy dữ liêu từ cookie đã tạo
app.use(cors())

// Define Route
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/workout", authenticationToken, workoutRoute)

export default app
