import type { Header } from "@/components/Table/HeaderTable";
import ShowMore from "@/components/ShowMore/ShowMore";

import { enumTranslations } from "@/lib/enumTranslations";
import { formatDate } from "@/lib/formatDate";

import type { Car } from "../car.type";

export const columns: Header<Car>[] = [
  {
    key: "id",
    header: "المعرف",
    display: (data) => <ShowMore text={data.id} columns={8} />,
  },
  {
    key: "modelName",
    header: "موديل السيارة",
    display: (data) => data.modelName,
  },
  {
    key: "plateNumber",
    header: "رقم اللوحة",
    display: (data) => data.plateNumber,
  },
  {
    key: "gearType",
    header: "نوع الفتيس",
    display: (data) => enumTranslations[data.gearType],
  },
  {
    key: "carSessionPrice",
    header: "سعر الحصة",
    display: (data) => `${data.carSessionPrice} ج.م`,
  },
  {
    key: "isActive",
    header: "الحالة",
    display: (data) => (data.isActive ? "نشطة" : "متوقفة"),
  },
  {
    key: "createdAt",
    header: "تاريخ الإضافة",
    display: (data) => formatDate(data.createdAt, "date"),
  },
];