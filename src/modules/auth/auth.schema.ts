import z from "zod";

import {
  booleanQuery,
  password,
  phone,
  personName
} from "../../shared/utils/common.validation";

export const LoginSchema = {
  body: z.object({ phone, password }),
};

export const LogoutSchema = {
  query: z.object({ allDevices: booleanQuery.optional().default(false) }),
};

export const changePasswordSchema = {
  body: z.object({
    currentPassword: password,
    newPassword: password,
  }),
};

export const createFirstUserSchema = {
  body: z.object({
    name: personName,
    phone,
    email: z.email().optional()
  }),
};