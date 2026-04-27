import asyncHandler from "../middlewares/asyncHandler.js";
import AuthService from "../services/authService.js";
import TokenService from "../services/tokenService.js";
import UserService from "../services/userService.js";
import { buildRefreshTokenCookieOptions } from "../config/env.js";
import { parseSchema } from "../validators/common.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";

export const register = asyncHandler(async (req, res) => {
  const payload = parseSchema(registerSchema, req.body);
  await AuthService.register(payload);
  return res.sendStatus(204);
});

export const login = asyncHandler(async (req, res) => {
  const payload = parseSchema(loginSchema, req.body);
  const result = await AuthService.login(payload);

  res.cookie(
    "refreshToken",
    result.refreshToken,
    buildRefreshTokenCookieOptions(),
  );

  return res.status(200).json({
    message: `Người dùng ${result.userName} đã đăng nhập`,
    accessToken: result.accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  await UserService.incrementTokenVersion(req.user.id);
  await TokenService.revokeAllUserSessions(req.user.id);

  if (token) {
    await TokenService.revokeRefreshToken(token);
  }

  res.clearCookie("refreshToken", buildRefreshTokenCookieOptions(0));
  return res.sendStatus(204);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const result = await AuthService.refreshAccessToken(token);

  return res.status(200).json(result);
});
