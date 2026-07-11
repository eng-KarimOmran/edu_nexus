import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAllCarAndLesson } from "../api/employee.service";
import EmptyState from "@/components/EmptyState/EmptyState";
import { LoadingList } from "@/components/Loading/Loading";
import displayError from "@/lib/displayError";
import { formatArabicDayAndDate } from "@/lib/formatDate";
import type { CarWithLessons } from "../employee.type";
import { queryKey } from "@/features/lesson/lesson.constants";

import {
  RiMapPinLine,
  RiPhoneLine,
  RiUserStarLine,
  RiUser3Line,
} from "@remixicon/react";

export default function GetAllCarAndLesson() {
  const startTime = dayjs().startOf("day").toDate();
  const endTime = dayjs().add(7, "day").endOf("day").toDate();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [...queryKey, startTime],
    queryFn: () => getAllCarAndLesson({ query: { startTime, endTime } }),
    staleTime: Infinity,
    select: (res) => res.data.data,
  });

  if (isLoading) {
    return <LoadingList count={7} />;
  }

  if (error) {
    displayError({
      error,
      mes: "حدث خطأ أثناء جلب الجدول",
    });
  }

  if (!data.length) {
    return <EmptyState message="لا توجد سيارات" />;
  }

  const hours = Array.from({ length: 15 }, (_, i) => 9 + i);

  const days = Array.from({ length: 7 }, (_, i) => dayjs().add(i, "day"));

  const findLesson = (car: CarWithLessons, day: dayjs.Dayjs, hour: number) => {
    return car.lessons.find((lesson) => {
      const start = dayjs(lesson.startTime);
      const end = dayjs(lesson.endTime);

      const current = day.hour(hour).minute(0).second(0);

      return (
        current.isSame(day, "day") &&
        current.valueOf() >= start.valueOf() &&
        current.valueOf() < end.valueOf()
      );
    });
  };

  return (
    <section className="space-y-10">
      {days.map((day) => {
        const carHourMap = data.map((car) =>
          hours.map((hour) => findLesson(car, day, hour)),
        );

        const skipRemaining = new Array(data.length).fill(0);

        return (
          <div key={day.format("YYYY-MM-DD")}>
            <h2 className="mb-4 text-xl font-bold">
              {formatArabicDayAndDate(day.toDate())}
            </h2>

            <div className="overflow-auto rounded-lg border">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-3">الساعة</th>

                    {data.map((car) => (
                      <th key={car.id} className="border p-3">
                        {`${car.modelName}-${car.plateNumber}`}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {hours.map((hour, hourIndex) => (
                    <tr key={hour}>
                      <td className="border p-3 font-bold">
                        {dayjs().hour(hour).minute(0).format("hh:mm A")}
                      </td>

                      {data.map((car, carIndex) => {
                        if (skipRemaining[carIndex] > 0) {
                          skipRemaining[carIndex]--;
                          return null;
                        }

                        const lesson = carHourMap[carIndex][hourIndex];

                        if (!lesson) {
                          return (
                            <td
                              key={car.id}
                              className="border p-3 align-top min-w-44"
                            >
                              <span className="text-green-600 font-medium">
                                فارغة
                              </span>
                            </td>
                          );
                        }

                        let span = 1;
                        for (let i = hourIndex + 1; i < hours.length; i++) {
                          if (carHourMap[carIndex][i] === lesson) {
                            span++;
                          } else {
                            break;
                          }
                        }
                        skipRemaining[carIndex] = span - 1;

                        return (
                          <td
                            key={car.id}
                            rowSpan={span}
                            className="min-w-72 border p-3 align-top"
                          >
                            <div className="space-y-2.5">
                              {/* العميل */}
                              <div className="rounded-md bg-muted/40 p-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <RiUser3Line
                                    size={16}
                                    className="text-primary shrink-0"
                                  />
                                  <span className="text-muted-foreground">
                                    العميل:
                                  </span>
                                  <span>{lesson.client.name}</span>
                                </div>

                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                  <RiPhoneLine size={14} className="shrink-0" />
                                  <span>{lesson.client.phone}</span>
                                </div>
                              </div>

                              {/* الكابتن */}
                              <div className="rounded-md bg-muted/40 p-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <RiUserStarLine
                                    size={16}
                                    className="text-primary shrink-0"
                                  />
                                  <span className="text-muted-foreground">
                                    الكابتن:
                                  </span>
                                  <span>{lesson.jobProfile.user.name}</span>
                                </div>

                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                  <RiPhoneLine size={14} className="shrink-0" />
                                  <span>{lesson.jobProfile.user.phone}</span>
                                </div>
                              </div>

                              {/* المنطقة */}
                              <div className="flex items-center gap-2 rounded-md bg-muted/40 p-2 text-sm font-medium">
                                <RiMapPinLine
                                  size={16}
                                  className="text-primary shrink-0"
                                />
                                <span className="text-muted-foreground">
                                  المنطقة:
                                </span>
                                <span>{lesson.area.name}</span>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </section>
  );
}
