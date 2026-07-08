import {
  boolean,
  booleanQuery,
  id,
  jobProfileType,
  limit,
  page,
  number,
  price,
  supportType,
} from "../../shared/utils/common.validation";
import { z } from "zod";

export const createJobProfileSchema = {
  body: z.object({
    userId: id,

    jobProfileType,
    supportType: supportType.optional(),

    baseSalary: price.optional(),
    lessonPrice: price.optional(),

    targetCount: number.optional(),
    bonusAmount: price.optional(),
  }),
};

export const updateJobProfileSchema = {
  params: z.object({
    jobProfileId: id,
  }),

  body: z.object({
    jobProfileType: jobProfileType.optional(),
    supportType: supportType.optional(),

    isActive: boolean.optional(),

    baseSalary: price.optional(),
    lessonPrice: price.optional(),

    targetCount: number.optional(),
    bonusAmount: price.optional(),
  }),
};

export const deleteJobProfileSchema = {
  params: z.object({
    jobProfileId: id,
  }),
};

export const getJobProfileDetailsSchema = {
  params: z.object({
    jobProfileId: id,
  }),
};

export const getAllJobProfilesSchema = {
  query: z.object({
    page,
    limit,
    search: z.string().optional(),
    isActive: booleanQuery.optional(),
    jobProfileType: jobProfileType.optional(),
    supportType: supportType.optional(),
  }),
};