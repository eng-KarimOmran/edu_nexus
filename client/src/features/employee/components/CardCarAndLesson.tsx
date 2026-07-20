import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { BaseLesson } from "../employee.type";

import { Button } from "@/components/ui/button";

import {
  RiMapPinLine,
  RiPhoneLine,
  RiUserStarLine,
  RiUser3Line,
  RiWhatsappLine,
  RiAddLine,
  RiTimeLine,
  RiCarLine,
} from "@remixicon/react";

import { Link } from "react-router-dom";

import { ROUTE_BUILDERS } from "@/routes/routes.builders";

import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import { toast } from "sonner";
import type { Car } from "@/features/car/car.type";

export default function CardCarAndLesson({
  hour,
  lesson,
  day,
  car,
}: {
  hour: number;
  lesson?: BaseLesson;
  day: string;
  car: Car;
}) {
  const handleClick = (hour: number) => {
    const slotStart = dayjs(day)
      .hour(hour)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toISOString();

    console.log(car.id, slotStart);
    toast.warning("جاري العمل عل هذه الميزه");
  };

  return (
    <Card className="min-w-xs">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiCarLine className="size-5 text-primary" />
            <span className="font-medium">
              {car.modelName} - {car.plateNumber}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1">
            <RiTimeLine className="size-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              {formatHour(hour)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lesson ? (
          <div className="space-y-5 text-sm">
            <Separator />

            {/* بيانات العميل */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <RiUser3Line className="size-5 text-primary" />
                بيانات العميل
              </h3>

              <div className="flex items-center justify-between gap-2">
                <Link
                  to={ROUTE_BUILDERS.clientDetails(
                    lesson.academyId,
                    lesson.client.id,
                  )}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <RiUser3Line className="size-4" />
                  {lesson.client.name}
                </Link>

                <Link
                  to={ROUTE_BUILDERS.subscriptionDetails(
                    lesson.academyId,
                    lesson.subscriptionId,
                  )}
                  className="text-primary hover:underline"
                >
                  تفاصيل الاشتراك
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <a
                  href={`tel:${lesson.client.phone}`}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <RiPhoneLine className="size-4" />
                  {lesson.client.phone}
                </a>

                <a
                  href={`https://wa.me/2${lesson.client.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600"
                >
                  <RiWhatsappLine className="size-5" />
                </a>
              </div>
            </div>

            <Separator />

            {/* بيانات الكابتن */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <RiUserStarLine className="size-5 text-primary" />
                بيانات الكابتن
              </h3>

              <div className="flex items-center gap-2">
                <RiUserStarLine className="size-4" />
                <span>{lesson.jobProfile.user.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <a
                  href={`tel:${lesson.jobProfile.user.phone}`}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <RiPhoneLine className="size-4" />
                  {lesson.jobProfile.user.phone}
                </a>

                <a
                  href={`https://wa.me/2${lesson.jobProfile.user.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600"
                >
                  <RiWhatsappLine className="size-5" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <Button
            className="w-full h-24"
            variant="outline"
            onClick={() => handleClick(hour)}
          >
            <RiAddLine />
            إضافة حصة
          </Button>
        )}
      </CardContent>
      <CardFooter>
        {lesson ? (
          <div className="flex items-center gap-1">
            <RiMapPinLine className="size-4" />
            <p>{lesson?.area.name}</p>
          </div>
        ) : (
          ""
        )}
      </CardFooter>
    </Card>
  );
}

function formatHour(hour: number) {
  const period = hour >= 12 ? "م" : "ص";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour} ${period}`;
}
