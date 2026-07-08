import { useQuery } from "@tanstack/react-query";
import { getDashboardAnalytics } from "./statistics.service";
import { queryKey } from "../statistics.constants";
import dayjs from "dayjs";

export const useStatistics = ({ academyId, startDate, endDate }: { academyId?: string, startDate: string, endDate: string }) => {
    return useQuery({
        queryKey: [...queryKey, academyId, startDate, endDate],
        queryFn: () => {
            if (!academyId) throw Error("معرف الأكاديمية مطلوب");

            const date = {
                startDate: dayjs(startDate).startOf("day").toDate(),
                endDate: dayjs(endDate).endOf("day").toDate(),
            };

            return getDashboardAnalytics({
                params: { academyId: academyId! },
                query: date,
            });
        },
        select: (res) => res.data.data,
        staleTime: 1000 * 60,
    });
}