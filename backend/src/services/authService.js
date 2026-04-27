import bcrypt from "bcrypt";
import db from "../models/index.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/AppError.js";
import TokenService from "./tokenService.js";

class AuthService {
  static async register(payload) {
    const existingUser = await db.User.findOne({ where: { email: payload.email } });
    if (existingUser) {
      throw new ConflictError("Email đã tồn tại");
    }

    const defaultRole = await db.Role.findOne({ where: { name: "USER" } });
    if (!defaultRole) {
      throw new NotFoundError("Vai trò mặc định không được chọn");
    }

    const password_hash = await bcrypt.hash(payload.password, 10);

    await db.User.create({
      email: payload.email,
      password_hash,
      name: payload.name,
      role_id: defaultRole.id,
      date_of_birth: payload.birthday,
      height: payload.height,
      weight: payload.weight,
      gender: payload.gender,
    });
  }

  static async login({ email, password }) {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError("Email hoặc mật khẩu không chính xác");
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new UnauthorizedError("Email hoặc mật khẩu không chính xác");
    }

    const accessToken = TokenService.createAccessToken(user);
    const refreshToken = await TokenService.createRefreshSession(user);

    return {
      accessToken,
      refreshToken,
      userName: user.name,
    };
  }

  static async refreshAccessToken(token) {
    if (!token) {
      throw new UnauthorizedError("Vui lòng cung cấp refresh token");
    }

    const session = await db.RefreshToken.findOne({ where: { token } });
    if (!session) {
      throw new UnauthorizedError("Refresh token không hợp lệ");
    }

    if (session.expiryDate.getTime() < Date.now()) {
      await TokenService.revokeRefreshToken(token);
      throw new UnauthorizedError("Vui lòng đăng nhập lại");
    }

    const user = await db.User.findByPk(session.userId);
    if (!user) {
      throw new UnauthorizedError("Không tìm thấy người dùng");
    }

    if (session.tokenVersion !== user.tokenVersion) {
      await TokenService.revokeRefreshToken(token);
      throw new UnauthorizedError("Refresh token đã bị thu hồi");
    }

    return {
      accessToken: TokenService.createAccessToken(user),
    };
  }
}

export default AuthService;

