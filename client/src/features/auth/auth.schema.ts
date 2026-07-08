import z from "zod";

import {
    password,
    phone,
    personName,
    boolean
} from "@/lib/common.validation";

export const LoginSchema = {
    body: z.object({ phone, password }),
};

export const LogoutSchema = {
    query: z.object({ allDevices: boolean.optional() }),
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