import { useEffect } from "react";
import { useParams } from "react-router-dom";

import EmptyState from "@/components/EmptyState/EmptyState";
import DisplayDetails, {
  type DisplayDetailsProps,
} from "@/components/DisplayDetails/DisplayDetails";

import {
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiFingerprint2Line,
  RiMoneyDollarCircleLine,
  RiRoadMapLine,
  RiSettings3Line,
  RiTimeLine,
  RiUser3Line,
  RiSteering2Line,
} from "@remixicon/react";

import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";

import { enumTranslations } from "@/lib/enumTranslations";
import { formatDate } from "@/lib/formatDate";
import displayError from "@/lib/displayError";

import { LoadingCards, SkeletonGrid } from "@/components/Loading/Loading";

import { useLessonDetails } from "../api/lesson.query";

export default function LessonDetailsPage() {
  const { lessonId, academyId } = useParams();

  const { data, error, isLoading } = useLessonDetails(academyId, lessonId);

  useEffect(() => {
    if (error) {
      displayError({
        error,
        mes: "حدث خطأ أثناء تحميل بيانات الحصة.",
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonGrid height="h-20" count={1} />
        <LoadingCards count={10} />
      </div>
    );
  }

  if (!data) {
    return <EmptyState message="الحصة غير موجودة." />;
  }

  const displayConfig: DisplayDetailsProps = {
    header: {
      title: `${data.client.name} - ${formatDate(data.startTime, "date")}`,
    },

    basicInfo: {
      title: "بيانات الحصة",

      data: [
        {
          key: "client",
          title: "العميل",
          content: data.client.name,
          icon: RiUser3Line,
        },

        {
          key: "captain",
          title: "الكابتن",
          content: data.jobProfile.user.name,
          icon: RiSteering2Line,
        },

        {
          key: "car",
          title: "السيارة",
          content: `${data.car.modelName} - ${data.car.plateNumber}`,
          icon: RiSettings3Line,
        },

        {
          key: "area",
          title: "منطقة التدريب",
          content: data.area.name,
          icon: RiRoadMapLine,
        },

        {
          key: "transmission",
          title: "نوع التدريب",
          content: enumTranslations[data.transmission],
          icon: RiSettings3Line,
        },

        {
          key: "lessonStatus",
          title: "الحالة",
          content: (
            <BadgeDemo
              type={data.lessonStatus}
              text={enumTranslations[data.lessonStatus]}
            />
          ),
          icon: RiCheckboxCircleLine,
        },

        {
          key: "startTime",
          title: "موعد البداية",
          content: formatDate(data.startTime, "datetime"),
          icon: RiCalendarLine,
        },

        {
          key: "endTime",
          title: "موعد النهاية",
          content: formatDate(data.endTime, "datetime"),
          icon: RiCalendarLine,
        },

        {
          key: "sessionDurationMinutes",
          title: "مدة الحصة",
          content: `${data.sessionDurationMinutes} دقيقة`,
          icon: RiTimeLine,
        },

        {
          key: "expectedPaymentAmount",
          title: "المبلغ المتوقع",
          content: `${data.expectedPaymentAmount} ج.م`,
          icon: RiMoneyDollarCircleLine,
        },

        {
          key: "carSessionPrice",
          title: "سعر السيارة",
          content: `${data.carSessionPrice} ج.م`,
          icon: RiMoneyDollarCircleLine,
        },

        {
          key: "captainLessonPrice",
          title: "أجر الكابتن",
          content: `${data.captainLessonPrice} ج.م`,
          icon: RiMoneyDollarCircleLine,
        },

        {
          key: "id",
          title: "المعرف",
          content: data.id,
          icon: RiFingerprint2Line,
          copyButton: true,
        },

        {
          key: "createdAt",
          title: "تاريخ الإنشاء",
          content: formatDate(data.createdAt, "date").toString(),
          icon: RiCalendarLine,
        },
      ],
    },
  };

  return <DisplayDetails {...displayConfig} />;
}
