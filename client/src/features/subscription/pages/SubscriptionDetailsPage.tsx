import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  RiBookLine,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiFingerprint2Line,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiWallet3Line,
  RiUserLine,
} from "@remixicon/react";

import DisplayDetails, {
  type DisplayDetailsProps,
} from "@/components/DisplayDetails/DisplayDetails";
import EmptyState from "@/components/EmptyState/EmptyState";
import TableUi, { type DataTableProps } from "@/components/Table/TableUi";

import { formatDate } from "@/lib/formatDate";
import { enumTranslations } from "@/lib/enumTranslations";

import type { ErrorResponse } from "@/types/axios";

import { useSubscriptionDetails } from "../api/subscription.query";

import displayError from "@/lib/displayError";
import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";
import { Button } from "@/components/ui/button";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";
import { columns as ledgerTransactionColumns } from "@/features/ledgerTransaction/config/ledgerTransaction.columns";
import AddLedgerTransactionForm from "@/features/ledgerTransaction/components/ledgerTransactionForm/AddLedgerTransactionForm";
import { SubscriptionStatus } from "@/types/enums";
import type { WalletMovement } from "@/features/ledgerTransaction/ledgerTransaction.type";
import { columns as lessonColumns } from "@/features/lesson/config/lesson.columns";
import type { Lesson } from "@/features/lesson/lesson.type";
import AddLessonForm from "@/features/lesson/components/lessonForm/AddLessonForm";
import ActionsLesson from "@/features/lesson/config/lesson.actions";

export default function SubscriptionDetailsPage() {
  const navigate = useNavigate();

  const { academyId, subscriptionId } = useParams();

  const { data, isLoading, error } = useSubscriptionDetails(
    academyId,
    subscriptionId,
  );

  useEffect(() => {
    if (!error) return;

    displayError({
      error,
      mes: "حدث خطأ أثناء تحميل الاشتراك.",
    });

    const err = error as ErrorResponse;

    if (err.response?.status === 403) {
      navigate(-1);
    }
  }, [error, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <EmptyState message="الاشتراك غير موجود." />;
  }

  const allowedSessionBookingStatuses: SubscriptionStatus[] = [
    "ACTIVE",
    "GRACE_PERIOD",
    "PENDING_FIRST_SESSION",
  ];

  const displayConfig: DisplayDetailsProps = {
    header: {
      title: data.courseName,
      actions: (
        <Button asChild className="text-pink-500" variant={"link"}>
          <Link
            to={ROUTE_BUILDERS.clientDetails(data.academyId, data.clientId)}
          >
            ملف العميل
          </Link>
        </Button>
      ),
    },

    basicInfo: {
      title: "بيانات الاشتراك",

      data: [
        {
          key: "subscriptionStatus",
          title: "الحالة",
          content: (
            <BadgeDemo
              type={data.subscriptionStatus}
              text={enumTranslations[data.subscriptionStatus]}
            />
          ),
          icon: RiCheckboxCircleLine,
        },
        {
          key: "netPaidAmount",
          title: "إجمالي المدفوع",
          content: `${data.paymentSummary.netPaidAmount} ج.م`,
          icon: RiMoneyDollarCircleLine,
        },
        {
          key: "balance",
          title: "المبلغ المتبقى",
          content: `${data.paymentSummary.remainingAmount} ج.م`,
          icon: RiWallet3Line,
        },
        {
          key: "priceAtBooking",
          title: "اجمالي سعر الأشتراك",
          content: `${data.paymentSummary.totalAmountDue} ج.م`,
          icon: RiMoneyDollarCircleLine,
        },
        {
          key: "isPaidInFull",
          title: "السداد",
          content: (
            <BadgeDemo
              type={data.paymentSummary.isFullyPaid ? "TRUE" : "FALSE"}
              text={data.paymentSummary.isFullyPaid ? "مكتمل" : "غير مكتمل"}
            />
          ),
          icon: RiCheckboxCircleLine,
        },
        {
          key: "courseName",
          title: "البرنامج",
          content: data.courseName,
          icon: RiBookLine,
        },
        {
          key: "trainingTypeAtRegistration",
          title: "نوع التدريب",
          content: enumTranslations[data.trainingTypeAtRegistration],
          icon: RiUserLine,
        },
        {
          key: "sessionsBeforeFullPayment",
          title: "الحصص قبل السداد",
          content: data.sessionsBeforeFullPayment,
          icon: RiCalendarLine,
        },
        {
          key: "totalSessions",
          title: "عدد الحصص",
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
          key: "requiredInitialDeposit",
          title: "المقدم",
          content: `${data.requiredInitialDeposit} ج.م`,
          icon: RiWallet3Line,
        },

        {
          key: "createdAt",
          title: "تاريخ الإنشاء",
          content: formatDate(data.createdAt, "date"),
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

  const lessonTable: DataTableProps<Lesson> = {
    data: data.lessons,
    headers: lessonColumns,
    ButtonAddTable: {
      configDialog: {
        title: "إضافة حصة",
        description: "قم بإدخال بيانات الحصة.",
        children: (
          <AddLessonForm
            areaId={data.areaId}
            academyId={data.academyId}
            subscriptionId={data.id}
          />
        ),
      },
      disabled: !allowedSessionBookingStatuses.includes(
        data.subscriptionStatus,
      ),
    },
    actions: (item) => ActionsLesson({ item }),
  };

  const paymentTable: DataTableProps<WalletMovement> = {
    data: data.walletMovements,
    headers: ledgerTransactionColumns,
    ButtonAddTable: {
      configDialog: {
        title: "إضافة دفعة",
        description: "قم بإدخال بيانات الدفعة.",
        children: (
          <AddLedgerTransactionForm
            academyId={data.academyId}
            subscriptionId={data.id}
          />
        ),
      },
      disabled: data.paymentSummary.isFullyPaid,
    },
  };

  return (
    <DisplayDetails {...displayConfig}>
      <div className="space-y-6">
        <div className="bg-sidebar p-4 rounded-lg space-y-3">
          <h2 className="text-xl font-bold">الحصص</h2>
          <TableUi {...lessonTable} />
        </div>
        <div className="bg-sidebar p-4 rounded-lg space-y-3">
          <h2 className="text-xl font-bold">المدفوعات</h2>
          <TableUi {...paymentTable} />
        </div>
      </div>
    </DisplayDetails>
  );
}
