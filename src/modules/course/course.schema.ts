import z from "zod";
import {
  id,
  limit,
  positiveNumber,
  entityName,
  boolean,
  price,
  booleanQuery,
  page,
} from "../../shared/utils/common.validation";

export const CreateSchema = {
  params: z.object({ academyId: id }),
  body: z
    .object({
      name: entityName,
      description: z.string(),
      priceOriginal: price,
      priceDiscounted: price,
      requiredInitialDeposit: price.default(50),
      sessionsBeforeFullPayment: price,
      sessionDurationMinutes: positiveNumber.default(50),
      totalSessions: positiveNumber,
      featuredReason: z.string().optional(),
    })
    .refine((data) => data.priceOriginal >= data.priceDiscounted, {
      error: "السعر بعد الخصم يجب أن يكون أقل من أو يساوي السعر الأصلي",
      path: ["priceDiscounted"],
    }),
};

export const UpdateSchema = {
  params: z.object({ courseId: id, academyId: id }),
  body: z.object({
    name: entityName.optional(),
    description: z.string().optional(),
    priceOriginal: price.optional(),
    priceDiscounted: price.optional(),
    requiredInitialDeposit: price.optional(),
    sessionsBeforeFullPayment: price.optional(),
    totalSessions: positiveNumber.optional(),
    sessionDurationMinutes: positiveNumber.optional(),
    featuredReason: z.string().optional(),
    isActive: boolean.optional(),
  }).refine(
    (data) => {
      if (data.priceOriginal !== undefined && data.priceDiscounted !== undefined) {
        return data.priceOriginal >= data.priceDiscounted;
      }
      return true;
    },
    {
      message: "السعر بعد الخصم يجب أن يكون أقل من أو يساوي السعر الأصلي",
      path: ["priceDiscounted"],
    }
  ),
};

export const DeleteSchema = {
  params: z.object({ courseId: id, academyId: id }),
};

export const GetAllSchema = {
  params: z.object({ academyId: id }),
  query: z.object({
    page,
    limit,
    search: z.string().optional(),
    isActive: booleanQuery.optional(),
  }),
};

export const GetDetailsSchema = {
  params: z.object({ courseId: id, academyId: id }),
};

export const AddCourseFeaturesSchema = {
  params: z.object({ academyId: id, courseId: id }),
  body: z.object({
    text: z.string(),
  }),
};

export const DeleteCourseFeaturesSchema = {
  params: z.object({ academyId: id, courseId: id, featureId: id }),
};