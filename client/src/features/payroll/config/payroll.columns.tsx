import type { Header } from "@/components/Table/HeaderTable";
import ShowMore from "@/components/ShowMore/ShowMore";

import { formatDate } from "@/lib/formatDate";

import type { Payroll } from "../payroll.type";

export const columns: Header<Payroll>[] = [
  {
    key: "id",
    header: "المعرف",
    display: (data) => <ShowMore text={data.id} columns={8} />,
  },

  {
    key: "academy",
    header: "الأكاديمية",
    display: (data) => data.academy.name,
  },

  {
    key: "createdAt",
    header: "تاريخ الراتب",
    display: (data) => formatDate(data.createdAt, "date"),
  },

  {
    key: "baseSalary",
    header: "الراتب الأساسي",
    display: (data) => (data.baseSalary === 0 ? "-" : data.baseSalary),
  },

  {
    key: "totalLessonsCount",
    header: "عدد الحصص المحتسبة",
    display: (data) =>
      data.totalLessonsCount === 0 ? "-" : data.totalLessonsCount,
  },

  {
    key: "lessonsAmount",
    header: "أجر الحصة",
    display: (data) => (data.lessonsAmount === 0 ? "-" : data.lessonsAmount),
  },

  {
    key: "totalSubscriptionsCount",
    header: "عدد الاشتراكات",
    display: (data) =>
      data.totalSubscriptionsCount === 0 ? "-" : data.totalSubscriptionsCount,
  },

  {
    key: "subscriptionsAmount",
    header: "عمولة الاشتراك",
    display: (data) =>
      data.subscriptionsAmount === 0 ? "-" : data.subscriptionsAmount,
  },

  {
    key: "earningsAmount",
    header: "إجمالي أرباح الأداء",
    display: (data) => (data.earningsAmount === 0 ? "-" : data.earningsAmount),
  },

  {
    key: "grossAmount",
    header: "إجمالي الراتب",
    display: (data) => (data.grossAmount === 0 ? "-" : data.grossAmount),
  },

  {
    key: "bonusAmount",
    header: "المكافآت",
    display: (data) => (data.bonusAmount === 0 ? "-" : data.bonusAmount),
  },

  {
    key: "deductions",
    header: "إجمالي الخصومات",
    display: (data) => (data.deductions === 0 ? "-" : data.deductions),
  },

  {
    key: "netAmount",
    header: "صافي الراتب",
    display: (data) => (
      <span className="font-semibold text-green-600">
        {data.netAmount === 0 ? "-" : data.netAmount}
      </span>
    ),
  },
];
