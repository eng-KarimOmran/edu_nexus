import dayjs, { type ConfigType } from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

dayjs.locale("ar");

const CAIRO_TIMEZONE = "Africa/Cairo";

export const cairo = (value?: ConfigType) => value ? dayjs(value).tz(CAIRO_TIMEZONE) : dayjs().tz(CAIRO_TIMEZONE);

export default dayjs;