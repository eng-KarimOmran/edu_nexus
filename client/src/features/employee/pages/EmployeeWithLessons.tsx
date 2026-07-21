import { queryKey } from "@/features/lesson/lesson.constants";
import DateFilterActions from "@/features/statistics/components/DateFilterActions";
import type { DateFormProps } from "@/features/statistics/components/statisticsForm/DateForm";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { getEmployeeWithLessons } from "../api/employee.service";
import { LoadingCards } from "@/components/Loading/Loading";
import displayError from "@/lib/displayError";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/formatDate";
import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";
import { enumTranslations } from "@/lib/enumTranslations";

import {
  RiUserLine,
  RiPhoneLine,
  RiMapPin2Line,
  RiCarLine,
  RiUser3Line,
  RiSchoolLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiWalletLine,
  RiBankCardLine,
} from "@remixicon/react";

import EmptyState from "@/components/EmptyState/EmptyState";
import { Link } from "react-router-dom";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";
import { Button } from "@/components/ui/button";

export default function EmployeeWithLessons() {
  const initialDateFilter: DateFormProps = {
    startDate: dayjs().startOf("day").toISOString(),
    endDate: dayjs().endOf("day").toISOString(),
  };

  const [date, setDate] = useState<DateFormProps>(initialDateFilter);

  const {
    isLoading,
    data = [],
    error,
  } = useQuery({
    queryKey: [...queryKey, date.startDate, date.endDate],
    queryFn: () =>
      getEmployeeWithLessons({
        query: { startTime: date.startDate, endTime: date.endDate },
      }),
    select: (res) => res.data.data,
  });

  if (isLoading) {
    return <LoadingCards count={3} />;
  }

  if (error) {
    displayError({ error, mes: "حدث خطأ اثناء جلب الموظفين" });
  }

  return (
    <section className="space-y-6">
      <DateFilterActions
        setDate={setDate}
        date={date}
        initialDateFilter={initialDateFilter}
      />

      {data.length < 1 && (
        <EmptyState message="لا يوجد موظفين لديهم حصص في هذه الفترة" />
      )}

      <main className="space-y-6">
        <nav className="flex justify-around items-center flex-wrap">
          {data.map((u) => (
            <Button variant={"outline"}>
              <a href={`#${u.id}`}>{u.name}</a>
            </Button>
          ))}
        </nav>
        {data.map((u) => {
          const lessons = u.jobProfile.lessons;
          const totalLessons = lessons.length;
          const totalCollected = lessons.reduce(
            (sum, l) => sum + Number(l.walletMovement?.amount ?? 0),
            0,
          );

          return (
            <Card key={u.id} id={u.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RiUserLine className="size-5 text-primary" />
                  {u.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <RiPhoneLine className="size-4" />
                  {u.phone}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {lessons.map((l, index) => (
                    <li
                      key={l.id}
                      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="absolute inset-y-0 right-0 w-1.5 rounded-r-2xl bg-primary/60 transition-colors group-hover:bg-primary" />

                      <div className="flex items-center justify-between border-b pb-3">
                        <h3 className="flex items-center gap-2 text-base font-bold text-primary sm:text-lg">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {index + 1}
                          </span>
                          الحصة رقم {index + 1}
                        </h3>
                        <BadgeDemo
                          text={enumTranslations[l.lessonStatus]}
                          type={l.lessonStatus}
                        />
                      </div>

                      {/* بيانات العميل والاشتراك */}
                      <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3">
                        <span className="text-sm font-semibold text-muted-foreground">
                          بيانات العميل والاشتراك
                        </span>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="flex flex-wrap items-center gap-1.5 text-sm">
                            <RiUser3Line className="size-4 shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              العميل:
                            </span>
                            <Button
                              asChild
                              variant={"link"}
                              className="h-auto p-0 font-medium"
                            >
                              <Link
                                to={ROUTE_BUILDERS.clientDetails(
                                  l.academy.id,
                                  l.client.id,
                                )}
                              >
                                <span>{`${l.client.name} - ${l.client.phone}`}</span>
                              </Link>
                            </Button>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-sm">
                            <RiUser3Line className="size-4 shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              الاشتراك ({l.subscription.courseName}):
                            </span>
                            <Button
                              asChild
                              variant={"link"}
                              className="h-auto p-0 font-medium"
                            >
                              <Link
                                to={ROUTE_BUILDERS.subscriptionDetails(
                                  l.academy.id,
                                  l.subscription.id,
                                )}
                              >
                                <span>تفاصيل الاشتراك</span>
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* البيانات المالية */}
                      <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3">
                        <span className="text-sm font-semibold text-muted-foreground">
                          البيانات المالية
                        </span>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="flex items-center gap-2 text-sm">
                            <RiMoneyDollarCircleLine className="size-4 shrink-0 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">
                                المبلغ المتوقع دفعه:{" "}
                              </span>
                              <span className="font-medium">
                                {l.expectedPaymentAmount > 0
                                  ? l.expectedPaymentAmount
                                  : "-"}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <RiWalletLine className="size-4 shrink-0 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">
                                المبلغ المحصل:{" "}
                              </span>
                              <span className="font-medium">
                                {l.walletMovement?.amount ?? "-"}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <RiBankCardLine className="size-4 shrink-0 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">
                                طريقة الدفع:{" "}
                              </span>
                              <span className="font-medium">
                                {l.walletMovement
                                  ? enumTranslations[
                                      l.walletMovement.paymentMethod
                                    ]
                                  : "-"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* تفاصيل الحصة */}
                      <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="text-sm font-semibold text-muted-foreground">
                            تفاصيل الحصة
                          </span>
                          <Button
                            asChild
                            variant={"link"}
                            className="h-auto p-0 text-sm font-medium"
                          >
                            <Link
                              to={ROUTE_BUILDERS.lessonDetails(
                                l.academy.id,
                                l.id,
                              )}
                            >
                              عرض التفاصيل
                            </Link>
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="flex items-center gap-2 text-sm">
                            <RiCalendarLine className="size-4 shrink-0 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">
                                موعد الحصة:{" "}
                              </span>
                              <span className="font-medium">
                                {formatDate(l.startTime, "datetime")}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <RiSchoolLine className="size-4 shrink-0 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">
                                الأكاديمية:{" "}
                              </span>
                              <span className="font-medium">
                                {l.academy.name}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <RiMapPin2Line className="size-4 shrink-0 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">
                                المنطقة:{" "}
                              </span>
                              <span className="font-medium">{l.area.name}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <RiCarLine className="size-4 shrink-0 text-muted-foreground" />
                            <span>
                              <span className="text-muted-foreground">
                                السيارة:{" "}
                              </span>
                              <span className="font-medium">
                                {`${l.car.modelName} - ${l.car.plateNumber}`}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex flex-wrap items-center gap-4 border-t pt-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <RiSchoolLine className="size-4 text-primary" />
                  <span>إجمالي عدد الحصص: {totalLessons}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RiMoneyDollarCircleLine className="size-4 text-primary" />
                  <span>إجمالي المبلغ المحصل: {totalCollected}</span>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </main>
    </section>
  );
}
