import dayjs from "../../config/dayjs-config";

export const toEgyptDate = (val: unknown): Date => {
    return dayjs(val as any).tz("Africa/Cairo").toDate();
};