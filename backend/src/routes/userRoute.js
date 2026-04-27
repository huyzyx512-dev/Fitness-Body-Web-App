import express from "express"
import { getUser } from "../controllers/userController.js";
import { authenticationToken } from "../middlewares/authMiddleware.js";
import { updateUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", authenticationToken ,getUser)

// Update current user's profile (name, weight, height, gender, date_of_birth)
router.patch("/", authenticationToken, updateUser)

export default router