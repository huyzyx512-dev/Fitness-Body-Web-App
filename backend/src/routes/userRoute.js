import express from "express"
import { getUser } from "../controllers/userController.js";
import { authenticationToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticationToken ,getUser)

export default router