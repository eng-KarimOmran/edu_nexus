import z from "zod";
import * as Schema from "./public.schema";

export type GetAcademyDto = {
    params: z.infer<typeof Schema.GetAcademySchema.params>;
};

export type GetCoursesDto = {
    params: z.infer<typeof Schema.GetCoursesSchema.params>;
};

export type GetAreasDto = {
    params: z.infer<typeof Schema.GetAreasSchema.params>;
};

export type GetClientDto = {
    params: z.infer<typeof Schema.GetClientSchema.params>;
};

export type RegisterDto = {
    params: z.infer<typeof Schema.RegisterSchema.params>;
    body: z.infer<typeof Schema.RegisterSchema.body>;
};