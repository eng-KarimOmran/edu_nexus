import { cairo } from "@/lib/dayjs";


export type FormatType =
    | "time"
    | "date"
    | "datetime"
    | "dateWithDay"
    | "day"

export type DateFilter = "today" | "tomorrow";


export const formatDate = (
    dateString: string,
    type: FormatType = "datetime"
) => {
    if (!dateString) return "";

    const date = cairo(dateString);

    switch (type) {
        case "time":
            return date.format("hh:mm A");
        case "date":
            return date.format("D MMMM YYYY");
        case "dateWithDay":
            return date.format("D-M-YYYY dddd");
        case "day":
            return date.format("dddd");
        case "datetime":
        default:
            return date.format("D MMMM YYYY - hh:mm A");
    }
};

export const getDateRange = (date: DateFilter) => {
    const targetDate = cairo().add(date === "tomorrow" ? 1 : 0, "day");

    return {
        startTime: targetDate.startOf("day").toDate(),
        endTime: targetDate.endOf("day").toDate(),
    };
};