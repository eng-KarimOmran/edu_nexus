import type { Header } from "@/components/Table/HeaderTable";
import ShowMore from "@/components/ShowMore/ShowMore";

import { enumTranslations } from "@/lib/enumTranslations";
import { formatDate } from "@/lib/formatDate";

import type { Area } from "../area.type";

export const columns: Header<Area>[] = [
  {
    key: "id",
    header: "المعرف",
    display: (data) => <ShowMore text={data.id} columns={8} />,
  },
  {
    key: "name",
    header: "اسم المنطقة",
    display: (data) => data.name,
  },
  {
    key: "supportType",
    header: "نوع الدعم",
    display: (data) => enumTranslations[data.supportType],
  },
  {
    key: "isActive",
    header: "الحالة",
    display: (data) => (data.isActive ? "نشطة" : "متوقفة"),
  },
  {
    key: "createdAt",
    header: "تاريخ الإنشاء",
    display: (data) => formatDate(data.createdAt, "date"),
  },
];
