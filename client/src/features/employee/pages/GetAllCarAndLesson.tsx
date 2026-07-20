import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAllCarAndLesson } from "../api/employee.service";
import EmptyState from "@/components/EmptyState/EmptyState";
import { LoadingList } from "@/components/Loading/Loading";
import displayError from "@/lib/displayError";
import { formatArabicDayAndDate } from "@/lib/formatDate";

import type { BaseLesson } from "../employee.type";
import { queryKey } from "@/features/lesson/lesson.constants";

import {
  RiMapPinLine,
  RiUserStarLine,
  RiUser3Line,
  RiWhatsappLine,
  RiAddLine,
} from "@remixicon/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Link } from "react-router-dom";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const HOURS = Array.from({ length: 15 }, (_, i) => 9 + i);

export default function GetAllCarAndLesson() {
  const { startTime, endTime } = useMemo(
    () => ({
      startTime: dayjs().startOf("day").toDate(),
      endTime: dayjs().add(7, "day").endOf("day").toDate(),
    }),
    [],
  );

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

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => dayjs().add(i, "day")),
    [],
  );

  const lessonMap = useMemo(() => {
    const map = new Map<string, BaseLesson>();
    data.forEach((car) => {
      car.lessons.forEach((lesson) => {
        const day = dayjs(lesson.startTime).format("YYYY-MM-DD");
        const hour = dayjs(lesson.startTime).hour();
        map.set(`${car.id}-${day}-${hour}`, lesson);
      });
    });
    return map;
  }, [data]);

  const handleSlotClick = (carId: string, day: Date, hour: number) => {
    const startTime = dayjs(day)
      .hour(hour)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();

    console.log(carId, startTime);
    toast.warning("جاري العمل عل هذه الميزه");
  };

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
    return <EmptyState message="لا يوجد بيانات لعرضها" />;
  }

  return (
    <section className="space-y-6">
      {days.map((day) => {
        const dayKey = day.format("YYYY-MM-DD");
        const isToday = day.isSame(dayjs(), "day");

        return (
          <div
            key={dayKey}
            className="rounded-xl border bg-card overflow-hidden"
          >
            <div
              className={cn(
                "flex items-center justify-between px-4 py-2.5 border-b",
                isToday ? "bg-primary/5" : "bg-muted",
              )}
            >
              <h2 className="text-sm font-semibold">
                {formatArabicDayAndDate(day.toDate())}
              </h2>
              {isToday && (
                <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                  اليوم
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="sticky right-0 z-20 w-16 bg-muted/60 backdrop-blur-sm text-center">
                      الساعة
                    </TableHead>
                    {data.map((car) => (
                      <TableHead
                        key={car.id}
                        className="min-w-47.5 bg-muted/60 backdrop-blur-sm sticky top-0 z-10"
                      >
                        {`${car.modelName} - ${car.plateNumber}`}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {HOURS.map((h) => (
                    <TableRow key={h}>
                      <TableCell className="sticky right-0 z-10 bg-background text-center text-xs font-medium text-muted-foreground border-e">
                        {formatHour(h)}
                      </TableCell>
                      {data.map((car) => {
                        const lesson = lessonMap.get(
                          `${car.id}-${dayKey}-${h}`,
                        );

                        return (
                          <TableCell key={car.id} className="align-top p-1.5">
                            {lesson ? (
                              <LessonSlot lesson={lesson} />
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  handleSlotClick(car.id, day.toDate(), h)
                                }
                                aria-label={`إضافة حصة - ${car.modelName} ${car.plateNumber} - ${formatArabicDayAndDate(day.toDate())} - ${formatHour(h)}`}
                                className="flex w-full min-h-26 flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <RiAddLine className="size-4" />
                                <span className="text-xs">إضافة حصة</span>
                              </button>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function LessonSlot({ lesson }: { lesson: BaseLesson }) {
  return (
    <div className="flex h-full flex-col gap-1.5 rounded-md border border-e-4 border-e-primary bg-card p-2 text-md">
      <div className="flex items-center justify-between gap-1">
        <Link
          to={ROUTE_BUILDERS.clientDetails(lesson.academyId, lesson.client.id)}
          className="flex min-w-0 items-center gap-1 font-medium hover:underline"
        >
          <RiUser3Line className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{lesson.client.name}</span>
        </Link>

        <a
          href={`https://wa.me/2${lesson.client.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="مراسلة العميل عبر واتساب"
          className="shrink-0 text-green-600 hover:text-green-700"
        >
          <RiWhatsappLine className="size-4" />
        </a>
      </div>

      <Link
        to={ROUTE_BUILDERS.subscriptionDetails(
          lesson.academyId,
          lesson.subscriptionId,
        )}
        className="flex min-w-0 items-center gap-1 font-medium hover:underline"
      >
        <RiUser3Line className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">تفاصيل الأشتراك</span>
      </Link>

      <a
        href={`tel:${lesson.client.phone}`}
        dir="ltr"
        className="text-end text-muted-foreground hover:underline"
      >
        {lesson.client.phone}
      </a>

      <div className="flex items-center gap-1 border-t pt-1.5 text-muted-foreground">
        <RiUserStarLine className="size-3.5 shrink-0" />
        <span className="truncate">{lesson.jobProfile.user.name}</span>
      </div>

      <a
        href={`tel:${lesson.jobProfile.user.phone}`}
        dir="ltr"
        className="text-end text-muted-foreground hover:underline"
      >
        {lesson.jobProfile.user.phone}
      </a>

      <div className="flex items-center gap-1 text-muted-foreground">
        <RiMapPinLine className="size-3.5 shrink-0" />
        <span className="truncate">{lesson.area.name}</span>
      </div>
    </div>
  );
}

function formatHour(hour: number) {
  const period = hour >= 12 ? "م" : "ص";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour} ${period}`;
}
