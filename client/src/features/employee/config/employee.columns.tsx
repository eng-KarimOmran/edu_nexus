import ShowMore from "@/components/ShowMore/ShowMore";
import type { Header } from "@/components/Table/HeaderTable";
import type { Lesson } from "../employee.type";
import { formatDate } from "@/lib/formatDate";

export const lessonColumns: Header<Lesson>[] = [
  {
    key: "id",
    header: "المعرف",
    display: (lesson) => <ShowMore text={lesson.id} columns={6} />,
  },

  {
    key: "startTime",
    header: "بداية الحصة",
    display: (lesson) => formatDate(lesson.startTime, "time"),
  },

  {
    key: "startTime",
    header: "نهاية الحصة",
    display: (lesson) => formatDate(lesson.endTime, "time"),
  },

  {
    key: "jobProfile",
    header: "المدرب",
    display: (lesson) => (
      <div className="flex flex-col">
        <span>{lesson.jobProfile.user.name}</span>
        <span>{lesson.jobProfile.user.phone}</span>
      </div>
    ),
  },

  {
    key: "car",
    header: "السيارة",
    display: (lesson) => `${lesson.car.modelName} (${lesson.car.plateNumber})`,
  },

  {
    key: "client",
    header: "العميل",
    display: (lesson) => (
      <div className="flex flex-col">
        <span>{lesson.client.name}</span>
        <span>{lesson.client.phone}</span>
      </div>
    ),
  },

  {
    key: "area",
    header: "المنطقة",
    display: (lesson) => lesson.area.name,
  },

  {
    key: "academy",
    header: "الأكاديمية",
    display: (lesson) => lesson.academy.name,
  },
];