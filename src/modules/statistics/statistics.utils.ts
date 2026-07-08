import dayjs from "dayjs";

interface DashboardTimeFramesParams {
    startDate?: Date;
    endDate?: Date;
}

export const getDashboardTimeFrames = ({
    startDate,
    endDate,
}: DashboardTimeFramesParams) => {
    const now = dayjs();

    const start = startDate
        ? dayjs(startDate).startOf("day").toDate()
        : now.startOf("day").toDate();

    const end = endDate
        ? dayjs(endDate).endOf("day").toDate()
        : now.endOf("day").toDate();

    return {
        operational: {
            gte: start,
            lte: end,
        },
        financial: {
            gte: start,
            lte: end,
        },
    };
};