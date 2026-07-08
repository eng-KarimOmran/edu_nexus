import type { Header } from "@/components/Table/HeaderTable";
import ShowMore from "@/components/ShowMore/ShowMore";

import { formatDate } from "@/lib/formatDate";

import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";

import type { Course } from "../course.type";

export const columns: Header<Course>[] = [
  {
    key: "id",
    header: "المعرف",
    display: (data) => <ShowMore text={data.id} columns={8} />,
  },
  {
    key: "name",
    header: "اسم البرنامج",
    display: (data) => data.name,
  },
  {
    key: "priceOriginal",
    header: "السعر الأصلي",
    display: (data) => `${data.priceOriginal} ج.م`,
  },
  {
    key: "priceDiscounted",
    header: "بعد الخصم",
    display: (data) => `${data.priceDiscounted} ج.م`,
  },
  {
    key: "totalSessions",
    header: "عدد الحصص",
    display: (data) => data.totalSessions,
  },
  {
    key: "isActive",
    header: "الحالة",
    display: (data) => (
      <BadgeDemo
        type={data.isActive ? "TRUE" : "FALSE"}
        text={data.isActive ? "نشط" : "غير نشط"}
      />
    ),
  },
  {
    key: "createdAt",
    header: "تاريخ الإنشاء",
    display: (data) => formatDate(data.createdAt, "date"),
  },
];