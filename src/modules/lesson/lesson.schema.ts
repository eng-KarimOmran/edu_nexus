import z from "zod";

import {
  id,
  limit,
  lessonStatus,
  transmission,
  price,
  page,
  date,
} from "../../shared/utils/common.validation";

export const CreateLessonSchema = {
  params: z.object({
    academyId: id,
  }),
  body: z.object({
    startTime: date,
    transmission: transmission,
    expectedPaymentAmount: price.optional(),
    jobProfileId: id,
    carId: id,
    areaId: id,
    subscriptionId: id,
  }),
};

export const GetAllLessonsSchema = {
  params: z.object({
    academyId: id,
  }),
  query: z.object({
    page,
    limit,
    transmission: transmission.optional(),
    lessonStatus: lessonStatus.optional(),
    search: z.string().optional(),
    startTime: date.optional(),
    endTime: date.optional(),
  }),
};

export const GetLessonDetailsSchema = {
  params: z.object({
    academyId: id,
    lessonId: id,
  }),
};

export const ChangeLessonStateSchema = {
  params: z.object({ lessonId: id, academyId: id }),
  body: z.object({
    lessonStatus: lessonStatus,
    amount: price.optional()
  })
};

export const UpdateLessonSchema = {
  params: z.object({
    academyId: id,
    lessonId: id,
  }),
  body: z.object({
    startTime: date.optional(),
    transmission: transmission.optional(),
    expectedPaymentAmount: price.optional(),
    jobProfileId: id.optional(),
    carId: id.optional(),
    areaId: id.optional(),
  }),
};
