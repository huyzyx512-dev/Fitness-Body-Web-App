import express from "express"
import cors from "cors"
import homeRoute from "./routes/homeRoute.js"

const app = express()

app.use(cors())
app.use(express.json())

// Define Route
app.use("/api", homeRoute)

export default app
