import { z } from "zod";
import * as Schema from "./statistics.schema";

export type GetDashboardAnalyticsDto = {
    params: z.infer<typeof Schema.GetDashboardAnalyticsSchema.params>
    query: z.infer<typeof Schema.GetDashboardAnalyticsSchema.query>
}