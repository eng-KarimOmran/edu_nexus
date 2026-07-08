import type { Header } from "@/components/Table/HeaderTable";
import ShowMore from "@/components/ShowMore/ShowMore";
import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";

import { formatDate } from "@/lib/formatDate";

import type { Subscription } from "../subscription.type";
import { enumTranslations } from "@/lib/enumTranslations";

export const columns: Header<Subscription>[] = [
  {
    key: "id",
    header: "المعرف",
    display: (item) => <ShowMore text={item.id} columns={8} />,
  },
  {
    key: "courseName",
    header: "البرنامج",
    display: (item) => item.courseName,
  },
  {
    key: "trainingTypeAtRegistration",
    header: "نوع التدريب",
    display: (item) => enumTranslations[item.trainingTypeAtRegistration],
  },
  {
    key: "priceAtBooking",
    header: "السعر",
    display: (item) => `${item.priceAtBooking} ج.م`,
  },
  {
    key: "totalSessions",
    header: "الحصص",
    display: (item) => item.totalSessions,
  },
  {
    key: "subscriptionStatus",
    header: "الحالة",
    display: (item) => (
      <BadgeDemo
        text={enumTranslations[item.subscriptionStatus]}
        type={item.subscriptionStatus}
      />
    ),
  },
  {
    key: "createdAt",
    header: "تاريخ الإنشاء",
    display: (item) => formatDate(item.createdAt, "date"),
  },
];