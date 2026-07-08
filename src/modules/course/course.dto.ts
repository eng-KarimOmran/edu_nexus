import z from "zod";
import * as Schema from "./course.schema";

export type CreateCourseDto = {
  params: z.infer<typeof Schema.CreateSchema.params>;
  body: z.infer<typeof Schema.CreateSchema.body>;
};

export type UpdateCourseDto = {
  params: z.infer<typeof Schema.UpdateSchema.params>;
  body: z.infer<typeof Schema.UpdateSchema.body>;
};

export type DeleteCourseDto = {
  params: z.infer<typeof Schema.DeleteSchema.params>;
};

export type GetAllCoursesDto = {
  params: z.infer<typeof Schema.GetAllSchema.params>;
  query: z.infer<typeof Schema.GetAllSchema.query>;
};

export type GetCourseDetailsDto = {
  params: z.infer<typeof Schema.GetDetailsSchema.params>;
};

export type AddCourseFeaturesDto = {
  params: z.infer<typeof Schema.AddCourseFeaturesSchema.params>;
  body: z.infer<typeof Schema.AddCourseFeaturesSchema.body>;
};

export type DeleteCourseFeaturesDto = {
  params: z.infer<typeof Schema.DeleteCourseFeaturesSchema.params>;
};