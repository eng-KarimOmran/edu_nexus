import z from "zod";

import {
  id,
  limit,
  transmission,
  subscriptionStatus,
  page,
} from "../../shared/utils/common.validation";

export const CreateSubscriptionSchema = {
  params: z.object({
    academyId: id,
  }),
  body: z.object({
    clientId: id,
    courseId: id,
    areaId: id,
    trainingTypeAtRegistration: transmission,
  }),
};

export const GetAllSubscriptionsSchema = {
  params: z.object({
    academyId: id,
  }),
  query: z.object({
    page,
    limit,
    search: z.string().optional(),
    subscriptionStatus: subscriptionStatus.optional(),
  }),
};

export const GetSubscriptionDetailsSchema = {
  params: z.object({ subscriptionId: id, academyId: id }),
};

export const DeleteSubscriptionSchema = {
  params: z.object({
    subscriptionId: id,
    academyId: id,
  }),
};

export const CancelSubscriptionSchema = {
  params: z.object({
    academyId: id,
    subscriptionId: id,
  }),
};