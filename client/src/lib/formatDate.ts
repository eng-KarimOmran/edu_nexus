import dayjs from "dayjs";

type FormatType = "time" | "date" | "datetime";

export type DateFilter = "today" | "tomorrow";


export const formatDate = (dateString: string, type?: FormatType) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    switch (type) {
        case "time":
            return date.toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

        case "date":
            return date.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

        case "datetime":
        default:
            return date.toLocaleString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
    }
};

export function formatArabicDayAndDate(date: Date | string): string {
    const d = new Date(date);

    const dayName = new Intl.DateTimeFormat("ar-EG", {
        weekday: "long",
    }).format(d);

    const formattedDate = new Intl.DateTimeFormat("en-GB").format(d);

    return `${dayName} - ${formattedDate}`;
}


export const getDateRange = (date: DateFilter) => {
    const targetDate = dayjs().add(date === "tomorrow" ? 1 : 0, "day");

    return {
        startTime: targetDate.startOf("day").toDate(),
        endTime: targetDate.endOf("day").toDate(),
    };
};