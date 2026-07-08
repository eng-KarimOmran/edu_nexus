import z from "zod";

import {
  id,
  personName,
  password,
  phone,
  limit,
  boolean,
  booleanQuery,
  page,
} from "../../shared/utils/common.validation";

export const CreateUserSchema = {
  body: z.object({
    name: personName,
    phone,
  }),
};

export const UpdateUserSchema = {
  params: z.object({ userId: id }),
  body: z.object({
    name: personName.optional(),
    phone: phone.optional(),
    email: z.email().optional(),
    isActive: boolean.optional(),
    isAdmin: boolean.optional()
  }),
};

export const DeleteUserSchema = {
  params: z.object({ userId: id }),
};

export const GetUserDetailsSchema = {
  params: z.object({ userId: id }),
};

export const GetAllUsersSchema = {
  query: z.object({
    page,
    limit,
    search: z.string().optional(),
    isActive: booleanQuery.optional(),
    isAdmin: booleanQuery.optional()
  }),
};

export const newPasswordSchema = {
  params: z.object({ userId: id }),
  body: z.object({
    newPassword: password,
  }),
};