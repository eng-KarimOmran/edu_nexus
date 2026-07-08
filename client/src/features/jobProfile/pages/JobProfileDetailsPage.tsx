import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmptyState from "@/components/EmptyState/EmptyState";
import DisplayDetails, {
  type DisplayDetailsProps,
} from "@/components/DisplayDetails/DisplayDetails";

import {
  RiFingerprint2Line,
  RiMoneyDollarCircleLine,
  RiSettings3Line,
  RiCheckboxCircleLine,
  RiCalendarLine,
  RiUserLine,
  RiAwardLine,
  RiPriceTag3Line,
  RiShieldUserLine,
  RiSchoolFill,
} from "@remixicon/react";

import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";

import { enumTranslations } from "@/lib/enumTranslations";
import { formatDate } from "@/lib/formatDate";
import displayError from "@/lib/displayError";

import type { ErrorResponse } from "@/types/axios";

import { LoadingCards, SkeletonGrid } from "@/components/Loading/Loading";

import { useJobProfileDetails } from "../api/jobProfile.query";
import { Button } from "@/components/ui/button";
import type { DataTableProps } from "@/components/Table/TableUi";
import type { Payroll } from "@/features/payroll/payroll.type";
import { usePayrolls } from "@/features/payroll/api/payroll.query";
import { columns } from "@/features/payroll/config/payroll.columns";
import TableUi from "@/components/Table/TableUi";
import TransferFundsForm from "@/features/ledgerTransaction/components/ledgerTransactionForm/TransferFundsForm";
import { useDialogState } from "@/store/DialogState";
import AddPayrollForm from "@/features/payroll/components/formsPayroll/AddPayrollForm";
import DeletePayrollForm from "@/features/payroll/components/formsPayroll/DeletePayrollForm";
import type { CreatePayrollDto } from "@/features/payroll/payroll.dto";
import ActionsPayroll from "@/features/payroll/config/payroll.actions";

export default function JobProfileDetailsPage() {
  const { jobProfileId } = useParams();

  const navigate = useNavigate();

  const { setConfigDialog } = useDialogState();

  const { data, error, isLoading } = useJobProfileDetails(jobProfileId);

  const { data: payrolls, isLoading: isLoadingPayrolls } = usePayrolls({
    jobProfileId: data?.id,
  });

  useEffect(() => {
    if (!error) return;

    displayError({
      error,
      mes: "حدث خطأ أثناء تحميل بيانات الموظف.",
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
        <LoadingCards count={8} />
      </div>
    );
  }

  if (!data) {
    return <EmptyState message="الملف الوظيفي غير موجود." />;
  }

  const displayConfigDetails: DisplayDetailsProps = {
    header: {
      title: data.user.name,
    },

    basicInfo: {
      title: "بيانات الملف الوظيفي",

      data: [
        {
          key: "user",
          title: "الموظف",
          content: data.user.name,
          icon: RiUserLine,
        },

        {
          key: "jobProfileType",
          title: "الصلاحية",
          content: enumTranslations[data.jobProfileType],
          icon: RiShieldUserLine,
        },

        {
          key: "supportType",
          title: "نوع الدعم",
          content: data.supportType
            ? enumTranslations[data.supportType]
            : "لا يوجد",
          icon: RiSettings3Line,
        },

        {
          key: "baseSalary",
          title: "الراتب الأساسي",
          content: `${data.baseSalary} ج.م`,
          icon: RiMoneyDollarCircleLine,
        },

        {
          key: "lessonPrice",
          title: "سعر الحصة",
          content: `${data.lessonPrice} ج.م`,
          icon: RiPriceTag3Line,
        },

        {
          key: "targetCount",
          title: "التارجت",
          content: data.targetCount,
          icon: RiAwardLine,
        },

        {
          key: "bonusAmount",
          title: "المكافأة",
          content: `${data.bonusAmount} ج.م`,
          icon: RiAwardLine,
        },

        {
          key: "isActive",
          title: "الحالة",
          content: (
            <BadgeDemo
              type={data.isActive ? "TRUE" : "FALSE"}
              text={data.isActive ? "نشط" : "متوقف"}
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

  const handleTransferFunds = ({
    academyId,
    wallet,
  }: {
    academyId: string;
    wallet: {
      id: string;
      balance: number;
    } | null;
  }) => {
    if (!wallet) return;
    setConfigDialog({
      title: "تسوية المديونية",
      description: "حوّل مبلغًا من رصيد الحساب لسداد المديونية.",
      children: (
        <TransferFundsForm
          academyId={academyId}
          amount={Math.abs(wallet.balance)}
          receiverWalletId={wallet.id}
        />
      ),
    });
  };

  const handlePayroll = ({
    add,
    remove,
  }: {
    add?: {
      subscriptionsAmount: number;
      lessonsAmount: number;
      baseSalary: number;
      academyId: string;
      jobProfileId: string;
    };
    remove?: {
      payrollId: string;
    };
  }) => {
    if (add) {
      const payrollFormData: CreatePayrollDto["body"] = {
        bonusAmount: 0,
        deductions: 0,
        ...add,
      };
      setConfigDialog({
        title: "تسوية المديونية",
        description: "حوّل مبلغًا من رصيد الحساب لسداد المديونية.",
        children: <AddPayrollForm {...payrollFormData} />,
      });
    }

    if (remove) {
      setConfigDialog({
        title: "تسوية المديونية",
        description: "حوّل مبلغًا من رصيد الحساب لسداد المديونية.",
        children: <DeletePayrollForm id={remove.payrollId} />,
      });
    }
  };

  const displayConfigWallets: DisplayDetailsProps = {
    basicInfo: {
      title: "بيانات الموظف فى الاكاديميات",
      data: data.academySummaries.map((j) => ({
        key: "academy",
        title: `اكاديمية ${j.academyName}`,
        content: (
          <ul className="space-y-1">
            <li className="flex items-center gap-0.5">
              <span>المديونية</span>
              {j.wallet ? (
                <>
                  <span>
                    {Math.abs(j.wallet.balance).toLocaleString("ar-EG")}
                  </span>
                  <span>ج.م</span>
                </>
              ) : (
                <span>لا يوجد محفظة</span>
              )}
            </li>

            <li className="flex items-center gap-0.5">
              <span>عدد الحصص</span>
              <span>{j.lessonCount}</span>
              <span>حصة</span>
            </li>

            <li className="flex items-center gap-0.5">
              <span>عدد الاشتراكات</span>
              <span>{j.subscriptionCount}</span>
              <span>اشتراك</span>
            </li>

            <li className="w-full flex justify-between items-center">
              <Button
                disabled={!j.wallet?.balance}
                onClick={() =>
                  handleTransferFunds({
                    academyId: j.academyId,
                    wallet: j.wallet,
                  })
                }
              >
                سداد المديونية
              </Button>
              <Button
                disabled={!j.lessonCount && !j.subscriptionCount}
                onClick={() => {
                  handlePayroll({
                    add: {
                      academyId: j.academyId,
                      baseSalary: data.baseSalary,
                      jobProfileId: data.id,
                      lessonsAmount: data.lessonPrice,
                      subscriptionsAmount:
                        data.bonusAmount > 0
                          ? Math.round(data.bonusAmount / data.targetCount)
                          : 0,
                    },
                  });
                }}
              >
                تسليم الراتب
              </Button>
            </li>
          </ul>
        ),
        icon: RiSchoolFill,
      })),
    },
  };

  const tableProps: DataTableProps<Payroll> = {
    data: payrolls?.items ?? [],
    maxPage: payrolls?.pagination.totalPages ?? 1,
    isLoading: isLoadingPayrolls,
    isLimit: true,
    isPagination: true,
    headers: columns,
    actions: (item) => <ActionsPayroll item={item} />,
  };

  return (
    <section className="space-y-6">
      <DisplayDetails {...displayConfigDetails} />
      {data.academySummaries.length > 0 && (
        <DisplayDetails {...displayConfigWallets} />
      )}
      <TableUi {...tableProps} />
    </section>
  );
}
