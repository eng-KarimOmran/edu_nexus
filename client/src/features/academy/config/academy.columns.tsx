import ShowMore from "@/components/ShowMore/ShowMore";
import type { Header } from "@/components/Table/HeaderTable";
import type { Academy } from "../academy.type";
import { formatDate } from "@/lib/formatDate";

const numColumns = 3;

export const columns: Header<Academy>[] = [
  {
    key: "id",
    header: "معرف الأكادمية",
    display: (data) => <ShowMore text={data.id} columns={numColumns} />,
  },
  {
    key: "name",
    header: "اسم الأكاديمية",
    display: (data) => data.name,
  },
  {
    key: "createdAt",
    header: "تاريخ انشاء الأكاديمية",
    display: (data) => formatDate(data.createdAt, "date"),
  },
];