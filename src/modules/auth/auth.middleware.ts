import dayjs from 'dayjs';
import { NextFunction, RequestHandler, Response } from 'express';
import { cookieAccess, cookieRefresh, Token } from './auth.utils';
import { RequestAuth, TokenType } from './auth.type';
import ApiError from '../../shared/utils/ApiError';
import { prisma } from "../../lib/prisma"

const clearAuthCookies = (res: Response) => {
  res.clearCookie("access", cookieAccess);
  res.clearCookie("refresh", cookieRefresh);
};

export const auth = (type: TokenType = TokenType.ACCESS): RequestHandler => {
  return async (req: RequestAuth, res: Response, next: NextFunction) => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;

    if (type === TokenType.ACCESS) {
      token = req.cookies.access ?? authHeader
    } else {
      token = req.cookies.refresh ?? authHeader
    }

    if (!token) throw ApiError.Unauthorized();

    const { payload } = Token.verifyToken({ token, type });

    if (!payload?.sub) throw ApiError.Unauthorized();

    const [blacklistedToken, user] = await Promise.all([
      prisma.blacklistedToken.findUnique({
        where: { jti: payload.jti },
      }),

      prisma.user.findUnique({
        where: { id: payload.sub },
        include: { academies: true, jobProfile: true },
      }),
    ]);

    if (blacklistedToken) {
      clearAuthCookies(res);
      throw ApiError.Unauthorized();
    }

    if (!user) {
      clearAuthCookies(res);
      throw ApiError.NotFound("User");
    }

    if (!user.isActive) {
      clearAuthCookies(res);
      throw ApiError.AccountBlocked();
    }

    const logoutTime = user.logoutAt
      ? dayjs(user.logoutAt).unix()
      : 0;

    if (payload.iat && payload.iat < logoutTime) {
      clearAuthCookies(res);
      throw ApiError.Unauthorized();
    }

    req.tokenPayload = payload;
    req.userLogin = user

    return next();
  };
};

export const checkPasswordChange = async (
  req: RequestAuth,
  _: Response,
  next: NextFunction,
) => {
  const user = req.userLogin;

  if (!user) throw ApiError.Unauthorized()

  if (!user.isPasswordChanged) {
    throw ApiError.passwordChangeRequired();
  }
  return next();
};