import z from "zod";
import * as Schema from "./user.schema";

export type CreateUserDto = {
  body: z.infer<typeof Schema.CreateUserSchema.body>;
};

export type UpdateUserDto = {
  params: z.infer<typeof Schema.UpdateUserSchema.params>;
  body: z.infer<typeof Schema.UpdateUserSchema.body>;
};

export type DeleteUserDto = {
  params: z.infer<typeof Schema.DeleteUserSchema.params>;
};

export type GetAllUsersDto = {
  query: z.infer<typeof Schema.GetAllUsersSchema.query>;
};

export type GetUserDetailsDto = {
  params: z.infer<typeof Schema.GetUserDetailsSchema.params>;
};

export type NewPasswordDto = {
  params: z.infer<typeof Schema.newPasswordSchema.params>;
  body: z.infer<typeof Schema.newPasswordSchema.body>;
};