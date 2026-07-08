import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmptyState from "@/components/EmptyState/EmptyState";
import DisplayDetails, {
  type DisplayDetailsProps,
} from "@/components/DisplayDetails/DisplayDetails";

import {
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiFingerprint2Line,
  RiMapPinLine,
  RiShieldUserLine,
} from "@remixicon/react";

import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";

import { enumTranslations } from "@/lib/enumTranslations";
import { formatDate } from "@/lib/formatDate";
import displayError from "@/lib/displayError";

import type { ErrorResponse } from "@/types/axios";

import { useAreaDetails } from "../api/area.query";
import { LoadingCards, SkeletonGrid } from "@/components/Loading/Loading";

export default function AreaDetailsPage() {
  const { academyId, areaId } = useParams();

  const navigate = useNavigate();

  const { data, error, isLoading } = useAreaDetails(academyId, areaId);

  useEffect(() => {
    if (!error) return;

    displayError({
      error,
      mes: "حدث خطأ أثناء تحميل بيانات المنطقة.",
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
    return <EmptyState message="المنطقة غير موجودة." />;
  }

  const displayConfig: DisplayDetailsProps = {
    header: {
      title: data.name,
    },

    basicInfo: {
      title: "بيانات المنطقة",

      data: [
        {
          key: "name",
          title: "اسم المنطقة",
          content: data.name,
          icon: RiMapPinLine,
        },

        {
          key: "supportType",
          title: "نوع الدعم",
          content: enumTranslations[data.supportType],
          icon: RiShieldUserLine,
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
          title: "تاريخ الإنشاء",
          content: formatDate(data.createdAt, "date").toString(),
          icon: RiCalendarLine,
        },
      ],
    },
  };

  return <DisplayDetails {...displayConfig} />;
}
