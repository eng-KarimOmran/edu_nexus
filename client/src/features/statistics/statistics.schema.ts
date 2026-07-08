import { date, id } from "@/lib/common.validation";
import z from "zod";

export const GetDashboardAnalyticsSchema = {
    params: z.object({ academyId: id }),
    query: z.object({ startDate: date, endDate: date }),
}