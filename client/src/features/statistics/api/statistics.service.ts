import { axiosClient } from "@/lib/axios";

import type { SuccessfulResponse } from "@/types/axios";
import type { GetDashboardAnalyticsDto } from "../statistics.dto";
import type { DashboardStatistics } from "../statistics.type";

type Entity = DashboardStatistics;

const statisticsUrl = {
    base: (academyId: string) => `/academies/${academyId}/statistic`,
};

export const getDashboardAnalytics = (data: GetDashboardAnalyticsDto) => {
    const { params, query } = data;
    const { academyId } = params;

    return axiosClient.get<SuccessfulResponse<Entity>>(statisticsUrl.base(academyId), { params: query });
};