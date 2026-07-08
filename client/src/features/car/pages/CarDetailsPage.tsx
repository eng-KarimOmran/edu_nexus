import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmptyState from "@/components/EmptyState/EmptyState";
import DisplayDetails, {
  type DisplayDetailsProps,
} from "@/components/DisplayDetails/DisplayDetails";

import {
  RiCarLine,
  RiFingerprint2Line,
  RiMoneyDollarCircleLine,
  RiSettings3Line,
  RiPriceTag3Line,
  RiCheckboxCircleLine,
  RiCalendarLine,
} from "@remixicon/react";

import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";

import { enumTranslations } from "@/lib/enumTranslations";
import { formatDate } from "@/lib/formatDate";
import displayError from "@/lib/displayError";

import type { ErrorResponse } from "@/types/axios";

import { useCarDetails } from "../api/car.query";
import { LoadingCards, SkeletonGrid } from "@/components/Loading/Loading";

export default function CarDetailsPage() {
  const { carId } = useParams();

  const navigate = useNavigate();

  const { data, error, isLoading } = useCarDetails(carId);

  useEffect(() => {
    if (!error) return;

    displayError({
      error,
      mes: "حدث خطأ أثناء تحميل بيانات السيارة.",
    });

    const err = error as ErrorResponse;

    if (err.response?.status === 403) {
      navigate(-1);
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonGrid height="h-20" count={1} />
        <LoadingCards count={6} />
      </div>
    );
  }

  if (!data) {
    return <EmptyState message="السيارة غير موجودة." />;
  }

  const displayConfig: DisplayDetailsProps = {
    header: {
      title: data.modelName,
    },

    basicInfo: {
      title: "بيانات السيارة",

      data: [
        {
          key: "modelName",
          title: "الموديل",
          content: data.modelName,
          icon: RiCarLine,
        },

        {
          key: "plateNumber",
          title: "رقم اللوحة",
          content: data.plateNumber,
          icon: RiPriceTag3Line,
        },

        {
          key: "gearType",
          title: "نوع الفتيس",
          content: enumTranslations[data.gearType],
          icon: RiSettings3Line,
        },

        {
          key: "carSessionPrice",
          title: "سعر الحصة",
          content: `${data.carSessionPrice} ج.م`,
          icon: RiMoneyDollarCircleLine,
        },

        {
          key: "isActive",
          title: "الحالة",
          content: (
            <BadgeDemo
              type={data.isActive ? "TRUE" : "FALSE"}
              text={data.isActive ? "نشطة" : "متوقفة"}
            />
          ),
          icon: RiCheckboxCircleLine,
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
          title: "تاريخ الإضافة",
          content: formatDate(data.createdAt, "date").toString(),
          icon: RiCalendarLine,
        },
      ],
    },
  };

  return <DisplayDetails {...displayConfig} />;
}
