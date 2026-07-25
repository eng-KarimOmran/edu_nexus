import { useQuery } from "@tanstack/react-query";
import { cairo } from "@/lib/dayjs";

import { getAllCarAndLesson } from "../api/employee.service";
import EmptyState from "@/components/EmptyState/EmptyState";
import { LoadingList } from "@/components/Loading/Loading";
import displayError from "@/lib/displayError";

import type { BaseLesson } from "../employee.type";
import { queryKey } from "@/features/lesson/lesson.constants";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CardCarAndLesson from "../components/CardCarAndLesson";
import { RiCalendarScheduleLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatDate";

export default function GetAllCarAndLesson() {
  const numberOfDays = 7;

  const today = cairo().startOf("day");

  const startTime = today.toDate();
  const endTime = today
    .add(numberOfDays - 1, "day")
    .endOf("day")
    .toDate();

  const days = Array.from({ length: numberOfDays }, (_, i) =>
    today.add(i, "day"),
  );

  const HOURS = Array.from({ length: 23 - 9 + 1 }, (_, i) => 9 + i);

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
    return null;
  }

  if (!data.length) {
    return <EmptyState message="لا توجد سيارات" />;
  }

  const carMap = new Map<string, BaseLesson>();

  data.forEach((car) => {
    car.lessons.forEach((lesson) => {
      const day = cairo(lesson.startTime).format("YYYY-MM-DD");
      const hour = cairo(lesson.startTime).format("H");
      carMap.set(`${car.id}-${day}-${hour}`, lesson);
    });
  });

  return (
    <section className="space-y-12">
      <nav className="flex items-center md:justify-between flex-wrap gap-1">
        {days.map((day) => {
          const dayKey = day.format("YYYY-MM-DD");
          const arabicDate = formatDate(day.toISOString(), "day");
          return (
            <a key={dayKey} href={`#${dayKey}`}>
              <Button variant={"outline"}>{arabicDate}</Button>
            </a>
          );
        })}
      </nav>
      {days.map((day) => {
        const dayKey = day.format("YYYY-MM-DD");

        return (
          <div
            id={dayKey}
            key={dayKey}
            className="space-y-4 bg-sidebar p-2 rounded-md"
          >
            <div className="flex items-center gap-2">
              <RiCalendarScheduleLine />
              <h2 className="text-primary shadow p-2 rounded-md font-bold">
                {formatDate(dayKey, "dateWithDay")}
              </h2>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  {data.map((car) => (
                    <TableHead key={car.id}>
                      {`${car.modelName}-${car.plateNumber}`}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {HOURS.map((hour) => (
                  <TableRow key={hour}>
                    {data.map((car) => {
                      const lesson = carMap.get(`${car.id}-${dayKey}-${hour}`);
                      return (
                        <TableCell
                          className="border"
                          key={`${dayKey}-${car.id}-${hour}`}
                        >
                          <CardCarAndLesson
                            car={car}
                            day={dayKey}
                            hour={hour}
                            lesson={lesson}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </section>
  );
}
