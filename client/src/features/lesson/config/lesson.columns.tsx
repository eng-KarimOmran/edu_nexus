import type { Header } from "@/components/Table/HeaderTable";
import ShowMore from "@/components/ShowMore/ShowMore";
import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";

import { enumTranslations } from "@/lib/enumTranslations";
import { formatDate } from "@/lib/formatDate";

import type { Lesson } from "../lesson.type";

export const columns: Header<Lesson>[] = [
  {
    key: "id",
    header: "المعرف",
    display: (data) => <ShowMore text={data.id} columns={8} />,
  },

  {
    key: "client",
    header: "العميل",
    display: (data) => (
      <div className="flex flex-col gap-1">
        <span>{data.client.name}</span>
        <span className="text-sm">{data.client.phone}</span>
      </div>
    ),
  },

  {
    key: "jobProfile",
    header: "الكابتن",
    display: (data) => (
      <div className="flex flex-col gap-1">
        <span>{data.jobProfile.user.name}</span>
        <span className="text-sm">{data.jobProfile.user.phone}</span>
      </div>
    ),
  },

  {
    key: "car",
    header: "السيارة",
    display: (data) => `${data.car.modelName} - ${data.car.plateNumber}`,
  },

  {
    key: "transmission",
    header: "نوع التدريب",
    display: (data) => enumTranslations[data.transmission],
  },

  {
    key: "lessonStatus",
    header: "الحالة",
    display: (data) => (
      <BadgeDemo
        type={data.lessonStatus}
        text={enumTranslations[data.lessonStatus]}
      />
    ),
  },

  {
    key: "expectedPaymentAmount",
    header: "المبلغ المتوقع",
    display: (data) => data.expectedPaymentAmount,
  },

  {
    key: "startTime",
    header: "موعد الحصة",
    display: (data) => formatDate(data.startTime, "datetime"),
  },
];
