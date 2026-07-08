import { enumTranslations } from "@/lib/enumTranslations";
import type { JobProfile } from "../jobProfile.type";
import type { Header } from "@/components/Table/HeaderTable";
import { formatDate } from "@/lib/formatDate";
import ShowMore from "@/components/ShowMore/ShowMore";

export const columns: Header<JobProfile>[] = [
  {
    key: "id",
    header: "معرف الملف",
    display: (data) => <ShowMore text={data.id} columns={11} />,
  },
  {
    key: "user",
    header: "الاسم",
    display: (data) => data.user.name,
  },
  {
    key: "user",
    header: "الهاتف",
    display: (data) => data.user.phone,
  },
  {
    key: "jobProfileType",
    header: "الصلاحية",
    display: (data) => enumTranslations[data.jobProfileType],
  },
  {
    key: "supportType",
    header: "نوع الدعم",
    display: (data) =>
      data.supportType ? enumTranslations[data.supportType] : "غير معروف",
  },
  {
    key: "baseSalary",
    header: "الراتب الأساسي",
    display: (data) => data.baseSalary,
  },
  {
    key: "lessonPrice",
    header: "سعر الحصة",
    display: (data) => data.lessonPrice,
  },
  {
    key: "targetCount",
    header: "التارجت",
    display: (data) => data.targetCount,
  },
  {
    key: "bonusAmount",
    header: "المكافأة",
    display: (data) => data.bonusAmount,
  },
  {
    key: "isActive",
    header: "الحالة",
    display: (data) => (data.isActive ? "نشط" : "غير نشط"),
  },
  {
    key: "createdAt",
    header: "تاريخ الأنضمام",
    display: (data) => formatDate(data.createdAt, "date"),
  },
];
