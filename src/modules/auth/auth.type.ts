import { NextFunction, Response } from 'express';
import { User } from '@/prisma/generated/client';
import { RequestValidation } from '../../shared/middlewares/validate.middleware';
import { JwtPayload } from "jsonwebtoken";
import { SafeUser } from '../user/user.type';

export enum TokenType {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
}

export interface ITokenPayload extends JwtPayload {
  id: string;
  exp: number
  jti: string
  sub: string
}

export interface VerifyTokenProps {
  token: string;
  type: TokenType;
}

export interface RequestAuth extends RequestValidation {
  tokenPayload?: ITokenPayload;
  userLogin?: User;
}

export interface IAuthService {
  login(data: {
    phone: string;
    password: string;
  }): Promise<{ tokens: { access: string; refresh: string; }; user: SafeUser }>;

  logout(data: { allDevices: boolean, exp: number, userId: string; jti: string }): Promise<boolean>;

  refresh(data: { userLogin: User, jti: string }): { access: string, user: SafeUser };

  changePassword(data: {
    userId: string;
    password: string;
    newPassword: string;
    currentPassword: string
  }): Promise<boolean>;

  createFirstUser(data: {
    name: string;
    phone: string;
    email?: string
  }): Promise<{
    id: string;
  }>;
}

export type AuthRequestHandler = (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => Promise<Response>