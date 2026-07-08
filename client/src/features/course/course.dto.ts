import z from "zod";

import * as Schema from "./course.schema";

export type CreateCourseDto = {
    params: z.infer<typeof Schema.CreateCourseSchema.params>;
    body: z.infer<typeof Schema.CreateCourseSchema.body>;
};

export type UpdateCourseDto = {
    params: z.infer<typeof Schema.UpdateCourseSchema.params>;
    body: z.infer<typeof Schema.UpdateCourseSchema.body>;
};

export type DeleteCourseDto = {
    params: z.infer<typeof Schema.DeleteCourseSchema.params>;
};

export type GetAllCoursesDto = {
    params: z.infer<typeof Schema.GetAllCoursesSchema.params>;
    query: z.infer<typeof Schema.GetAllCoursesSchema.query>;
};

export type GetCourseDetailsDto = {
    params: z.infer<typeof Schema.GetCourseDetailsSchema.params>;
};

export type AddCourseFeatureDto = {
    params: z.infer<typeof Schema.AddCourseFeatureSchema.params>;
    body: z.infer<typeof Schema.AddCourseFeatureSchema.body>;
};

export type DeleteCourseFeatureDto = {
    params: z.infer<typeof Schema.DeleteCourseFeatureSchema.params>;
};