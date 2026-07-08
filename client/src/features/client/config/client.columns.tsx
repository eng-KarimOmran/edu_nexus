import type { Header } from "@/components/Table/HeaderTable";
import ShowMore from "@/components/ShowMore/ShowMore";

import { enumTranslations } from "@/lib/enumTranslations";
import { formatDate } from "@/lib/formatDate";

import type { Client } from "../client.type";

export const columns: Header<Client>[] = [
  {
    key: "id",
    header: "المعرف",
    display: (data) => <ShowMore text={data.id} columns={10} />,
  },
  {
    key: "name",
    header: "الاسم",
    display: (data) => data.name,
  },
  {
    key: "phone",
    header: "رقم الهاتف",
    display: (data) => data.phone,
  },
  {
    key: "source",
    header: "المصدر",
    display: (data) => enumTranslations[data.source],
  },
  {
    key: "createdAt",
    header: "تاريخ الأنضمام",
    display: (data) => formatDate(data.createdAt, "date"),
  },
];