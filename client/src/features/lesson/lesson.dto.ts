import z from "zod";

import * as Schema from "./lesson.schema";

export type CreateLessonDto = {
  params: z.infer<typeof Schema.CreateLessonSchema.params>;
  body: z.infer<typeof Schema.CreateLessonSchema.body>;
};

export type UpdateLessonDto = {
  params: z.infer<typeof Schema.UpdateLessonSchema.params>;
  body: z.infer<typeof Schema.UpdateLessonSchema.body>;
};

export type GetAllLessonsDto = {
  params: z.infer<typeof Schema.GetAllLessonsSchema.params>;
  query: z.infer<typeof Schema.GetAllLessonsSchema.query>;
};

export type GetLessonDetailsDto = {
  params: z.infer<typeof Schema.GetLessonDetailsSchema.params>;
};

export type ChangeLessonStateDto = {
  params: z.infer<typeof Schema.ChangeLessonStateSchema.params>;
  body: z.infer<typeof Schema.ChangeLessonStateSchema.body>;
};