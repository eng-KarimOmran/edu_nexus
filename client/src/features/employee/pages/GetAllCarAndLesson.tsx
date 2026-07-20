import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

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
    return null;
  }

  if (!data.length) {
    return <EmptyState message="لا توجد سيارات" />;
  }

  const days = Array.from({ length: 7 }, (_, i) => dayjs().add(i, "day"));
  const HOURS = Array.from({ length: 15 }, (_, i) => 9 + i);

  const carMap = new Map<string, BaseLesson>();

  data.forEach((car) => {
    car.lessons.forEach((lesson) => {
      const day = dayjs(lesson.startTime).format("YYYY-MM-DD").toString();
      const hour = dayjs(lesson.startTime).hour();
      carMap.set(`${car.id}-${day}-${hour}`, lesson);
    });
  });

  return (
    <section className="space-y-12">
      {days.map((day) => {
        const dayKey = day.format("YYYY-MM-DD");

        const arabicDate = day.toDate().toLocaleDateString("ar-EG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return (
          <div key={dayKey} className="space-y-4 bg-sidebar p-2 rounded-md">
            <div className="flex items-center gap-2">
              <RiCalendarScheduleLine />
              <h2 className="text-primary shadow p-2 rounded-md font-bold">
                {arabicDate}
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
                        <TableCell key={`${dayKey}-${car.id}-${hour}`}>
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
