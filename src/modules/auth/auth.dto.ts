import z from "zod";
import * as Schema from "./auth.schema";

export type LoginDto = {
  body: z.infer<typeof Schema.LoginSchema.body>;
};

export type LogoutDto = {
  query: z.infer<typeof Schema.LogoutSchema.query>;
};

export type ChangePasswordDto = {
  body: z.infer<typeof Schema.changePasswordSchema.body>;
};

export type createFirstUserDto = {
  body: z.infer<typeof Schema.createFirstUserSchema.body>;
};

