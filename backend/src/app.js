import express from "express"
import cors from "cors"
import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"

const app = express()

// Define URL-encoded bodies
app.use(express.urlencoded({extended: false}))
// Parse JSON body
app.use(express.json())

app.use(cors())
app.use(express.json())

// Define Route
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)

export default app
