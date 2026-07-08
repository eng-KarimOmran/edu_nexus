import type { Header } from "@/components/Table/HeaderTable";
import type { User } from "../user.type";
import ShowMore from "@/components/ShowMore/ShowMore";

export const columns: Header<User>[] = [
  {
    key: "id",
    header: "معرف المستخدم",
    display: (data) => <ShowMore text={data.id} columns={4} />,
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
    key: "isActive",
    header: "الحالة",
    display: (data) => (data.isActive ? "نشط" : "غير نشط"),
  },
];
