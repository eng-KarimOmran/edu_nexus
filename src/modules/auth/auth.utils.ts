import * as argon2 from "argon2";
import { CookieOptions } from "express";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import env from "../../config/env";
import { ITokenPayload, VerifyTokenProps } from "./auth.type";

export const HashHelper = {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 4,
      parallelism: 2,
    });
  },

  async compare({ plainPassword, hashedPassword }: { plainPassword: string; hashedPassword: string }): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (error) {
      console.error("HashHelper compare error:", error);
      return false;
    }
  },
};

export const Token = {
  generateTokens: (userId: string) => {
    const {
      ACCESS_EXPIRATION,
      ACCESS_SECRET,
      REFRESH_EXPIRATION,
      REFRESH_SECRET,
    } = env.token;
    const jti = nanoid();

    const access = jwt.sign({}, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRATION,
      jwtid: jti,
      subject: userId
    });

    const refresh = jwt.sign({}, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRATION,
      jwtid: jti,
      subject: userId
    });
    return { access, refresh };
  },

  verifyToken: ({ type, token }: VerifyTokenProps): { payload?: ITokenPayload } => {
    const { ACCESS_SECRET, REFRESH_SECRET } = env.token;
    const secret = type === "ACCESS" ? ACCESS_SECRET : REFRESH_SECRET;
    try {
      const payload = jwt.verify(token, secret) as ITokenPayload
      return { payload }
    } catch (err) {
      return { payload: undefined }
    }
  },

  generateAccessToken: (userId: string, jti: string) => {
    const { ACCESS_SECRET, ACCESS_EXPIRATION } = env.token;
    const access = jwt.sign({}, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRATION,
      jwtid: jti,
      subject: userId
    });
    return access;
  }
}

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.app.nodeEnv === "production",
  sameSite: "strict",
  path: "/",
};

export const cookieRefresh = {
  ...cookieOptions,
  path: "/api/v1/auth",
  maxAge: env.token.REFRESH_EXPIRATION,
};

export const cookieAccess: CookieOptions = {
  ...cookieOptions,
  maxAge: env.token.ACCESS_EXPIRATION,
};