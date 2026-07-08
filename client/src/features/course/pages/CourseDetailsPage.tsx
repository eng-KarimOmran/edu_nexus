import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  RiBookLine,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiFingerprint2Line,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiWallet3Line,
} from "@remixicon/react";

import DisplayArray from "@/components/DisplayArray/DisplayArray";
import DisplayDetails, {
  type DisplayDetailsProps,
} from "@/components/DisplayDetails/DisplayDetails";
import EmptyState from "@/components/EmptyState/EmptyState";

import displayError from "@/lib/displayError";
import { formatDate } from "@/lib/formatDate";

import type { ErrorResponse } from "@/types/axios";

import { useCourseDetails } from "../api/course.query";

import AddCourseFeatureForm from "../components/featureForm/AddCourseFeatureForm";
import DeleteCourseFeatureForm from "../components/featureForm/DeleteCourseFeatureForm";
import { LoadingCards, SkeletonGrid } from "@/components/Loading/Loading";

export default function CourseDetailsPage() {
  const { academyId, courseId } = useParams();

  const navigate = useNavigate();

  const { data, isLoading, error } = useCourseDetails(academyId, courseId);

  useEffect(() => {
    if (!error) return;

    displayError({
      error,
      mes: "حدث خطأ أثناء تحميل بيانات البرنامج.",
    });

    const err = error as ErrorResponse;

    if (err.response?.status === 403) {
      navigate(-1);
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonGrid count={1} height="h-20" />
        <LoadingCards count={9} />
      </div>
    );
  }

  if (!data) {
    return <EmptyState message="البرنامج غير موجود." />;
  }

  const displayConfig: DisplayDetailsProps = {
    header: {
      title: data.name,
    },

    basicInfo: {
      title: "بيانات البرنامج",

      data: [
        {
          key: "name",
          title: "اسم البرنامج",
          content: data.name,
          icon: RiBookLine,
        },
        {
          key: "description",
          title: "الوصف",
          content: data.description,
          icon: RiBookLine,
        },
        {
          key: "priceOriginal",
          title: "السعر الأصلي",
          content: `${data.priceOriginal} ج.م`,
          icon: RiMoneyDollarCircleLine,
        },
        {
          key: "priceDiscounted",
          title: "السعر بعد الخصم",
          content: `${data.priceDiscounted} ج.م`,
          icon: RiMoneyDollarCircleLine,
        },
        {
          key: "requiredInitialDeposit",
          title: "المقدم",
          content: `${data.requiredInitialDeposit} ج.م`,
          icon: RiWallet3Line,
        },
        {
          key: "sessionsBeforeFullPayment",
          title: "الحصص قبل السداد",
          content: data.sessionsBeforeFullPayment,
          icon: RiCalendarLine,
        },
        {
          key: "totalSessions",
          title: "إجمالي الحصص",
          content: data.totalSessions,
          icon: RiCalendarLine,
        },
        {
          key: "sessionDurationMinutes",
          title: "مدة الحصة",
          content: `${data.sessionDurationMinutes} دقيقة`,
          icon: RiTimeLine,
        },
        {
          key: "featuredReason",
          title: "سبب التمييز",
          content: data.featuredReason || "-",
          icon: RiBookLine,
        },
        {
          key: "isActive",
          title: "الحالة",
          content: data.isActive ? "نشط" : "غير نشط",
          icon: RiCheckboxCircleLine,
        },
        {
          key: "createdAt",
          title: "تاريخ الإنشاء",
          content: formatDate(data.createdAt, "date").toString(),
          icon: RiCalendarLine,
        },
        {
          key: "id",
          title: "المعرف",
          content: data.id,
          icon: RiFingerprint2Line,
          copyButton: true,
        },
      ],
    },
  };

  return (
    <DisplayDetails {...displayConfig}>
      <DisplayArray
        title="مميزات البرنامج"
        data={data.features}
        titleKey="feature"
        forms={{
          add: () => (
            <AddCourseFeatureForm academyId={academyId!} courseId={data.id} />
          ),

          delete: (item) => (
            <DeleteCourseFeatureForm
              academyId={academyId!}
              courseId={data.id}
              featureId={item.id}
              feature={item.feature}
            />
          ),
        }}
      />
    </DisplayDetails>
  );
}
