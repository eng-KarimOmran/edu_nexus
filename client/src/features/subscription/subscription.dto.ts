import z from "zod";

import * as Schema from "./subscription.schema";

export type CreateSubscriptionDto = {
    params: z.infer<typeof Schema.CreateSubscriptionSchema.params>;
    body: z.infer<typeof Schema.CreateSubscriptionSchema.body>;
};

export type DeleteSubscriptionDto = {
    params: z.infer<typeof Schema.DeleteSubscriptionSchema.params>;
};

export type CancelSubscriptionDto = {
    params: z.infer<typeof Schema.CancelSubscriptionSchema.params>;
};

export type GetAllSubscriptionsDto = {
    params: z.infer<typeof Schema.GetAllSubscriptionsSchema.params>;
    query: z.infer<typeof Schema.GetAllSubscriptionsSchema.query>;
};

export type GetSubscriptionDetailsDto = {
    params: z.infer<typeof Schema.GetSubscriptionDetailsSchema.params>;
};