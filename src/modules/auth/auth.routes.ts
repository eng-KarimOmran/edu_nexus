import { auth } from './auth.middleware';
import { Router } from "express";
import validate from "../../shared/middlewares/validate.middleware";
import * as Schema from "./auth.schema";
import AuthController from "./auth.controller";
import { TokenType } from './auth.type';

const router = Router();

router.post(
  "/login",
  validate(Schema.LoginSchema),
  AuthController.login
);

router.post(
  "/first-user",
  validate(Schema.createFirstUserSchema),
  AuthController.createFirstUser
);

router.post(
  "/logout",
  validate(Schema.LogoutSchema),
  auth(TokenType.REFRESH),
  AuthController.logout
);

router.get(
  "/refresh",
  auth(TokenType.REFRESH),
  AuthController.refresh
);

router.patch(
  "/change-password",
  validate(Schema.changePasswordSchema),
  auth(TokenType.ACCESS),
  AuthController.changePassword,
);

export default router