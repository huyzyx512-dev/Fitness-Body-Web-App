import crypto from "crypto";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { appConfig } from "../config/env.js";

class TokenService {
  static createAccessToken(user) {
    return jwt.sign(
      { id: user.id, tokenVersion: user.tokenVersion },
      appConfig.accessTokenSecret,
      { expiresIn: "15m" },
    );
  }

  static generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
  }

  static async createRefreshSession(user) {
    const token = this.generateRefreshToken();

    await db.RefreshToken.create({
      token,
      expiryDate: new Date(Date.now() + appConfig.refreshTokenTtlMs),
      userId: user.id,
      tokenVersion: user.tokenVersion,
    });

    return token;
  }

  static async revokeRefreshToken(token) {
    if (!token) {
      return 0;
    }

    return db.RefreshToken.destroy({
      where: { token },
    });
  }

  static async revokeAllUserSessions(userId) {
    await db.RefreshToken.destroy({
      where: { userId },
    });
  }
}

export default TokenService;

