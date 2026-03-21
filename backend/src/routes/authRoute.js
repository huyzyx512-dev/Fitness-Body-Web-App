import express from "express"
import { login, logout, refreshToken, register } from "../controllers/authController.js";
import { authenticationToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticationToken, logout)
router.post("/refresh-token", refreshToken)

export default router