import dotenv from "dotenv";

dotenv.config();

const parseOrigins = (value) => {
  if (!value) {
    return ["http://localhost:5173"];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

export const appConfig = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT || 5000),
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "dev-access-token-secret",
  refreshTokenTtlMs: 14 * 24 * 60 * 60 * 1000,
};

export const buildRefreshTokenCookieOptions = (maxAge = appConfig.refreshTokenTtlMs) => ({
  httpOnly: true,
  secure: appConfig.isProduction,
  sameSite: appConfig.isProduction ? "none" : "lax",
  maxAge,
  ...(appConfig.cookieDomain ? { domain: appConfig.cookieDomain } : {}),
  path: "/",
});

