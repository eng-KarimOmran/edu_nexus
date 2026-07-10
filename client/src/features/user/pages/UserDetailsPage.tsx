import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import EmptyState from "@/components/EmptyState/EmptyState";
import DisplayDetails, {
  type DisplayDetailsProps,
} from "@/components/DisplayDetails/DisplayDetails";

import { LoadingCards, SkeletonGrid } from "@/components/Loading/Loading";

import displayError from "@/lib/displayError";
import { formatDate } from "@/lib/formatDate";

import {
  RiAddLargeLine,
  RiCalendarLine,
  RiFingerprint2Line,
  RiMailLine,
  RiPhoneLine,
  RiShieldUserLine,
  RiUser3Line,
} from "@remixicon/react";

import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";

import { useUserDetails } from "../api/user.query";
import type { DataTableProps } from "@/components/Table/TableUi";
import type { Academy } from "@/features/academy/academy.type";
import ShowMore from "@/components/ShowMore/ShowMore";
import { enumTranslations } from "@/lib/enumTranslations";
import TableUi from "@/components/Table/TableUi";
import {
  GetContactLink,
  GetWhatsappLink,
} from "@/components/GetPhoneLinks/GetPhoneLinks";
import type { JobProfile } from "@/features/jobProfile/jobProfile.type";
import { Button } from "@/components/ui/button";
import { useDialogState } from "@/store/DialogState";
import AddJobProfileForm from "@/features/jobProfile/components/jobProfileForm/AddJobProfileForm";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";

export default function UserDetailsPage() {
  const { userId } = useParams();
  const { setConfigDialog } = useDialogState();
  const { data, error, isLoading } = useUserDetails(userId);

  useEffect(() => {
    if (error) {
      displayError({
        error,
        mes: "حدث خطأ أثناء تحميل بيانات المستخدم.",
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonGrid count={1} height="h-20" />
        <LoadingCards count={3} />
      </div>
    );
  }

  if (!data) {
    return <EmptyState message="المستخدم غير موجود" />;
  }

  const handleOpenCreateJobProfile = () => {
    setConfigDialog({
      title: "إضافة وظيفة جديدة",
      description: "قم بإدخال بيانات الوظيفة.",
      children: <AddJobProfileForm userId={data.id} />,
    });
  };

  const displayConfig: DisplayDetailsProps = {
    header: {
      title: data.name,
      actions: (
        <div className="flex items-center gap-2">
          <GetContactLink phone={data.phone} />
          <GetWhatsappLink phone={data.phone} />
        </div>
      ),
    },

    basicInfo: {
      title: "البيانات الأساسية",

      data: [
        {
          key: "id",
          title: "المعرف",
          content: data.id,
          icon: RiFingerprint2Line,
          copyButton: true,
        },

        {
          key: "name",
          title: "الاسم",
          content: data.name,
          icon: RiUser3Line,
        },

        {
          key: "phone",
          title: "رقم الهاتف",
          content: data.phone,
          icon: RiPhoneLine,
          copyButton: true,
        },

        {
          key: "email",
          title: "البريد الإلكتروني",
          content: data.email ?? "غير موجود",
          icon: RiMailLine,
          copyButton: !!data.email,
        },

        {
          key: "isAdmin",
          title: "الصلاحية",
          content: (
            <BadgeDemo
              type={data.isAdmin ? "TRUE" : "FALSE"}
              text={data.isAdmin ? "مسؤل" : "مستخدم"}
            />
          ),
          icon: RiShieldUserLine,
        },

        {
          key: "isActive",
          title: "الحالة",
          content: (
            <BadgeDemo
              type={data.isActive ? "TRUE" : "FALSE"}
              text={data.isActive ? "نشط" : "غير نشط"}
            />
          ),
          icon: RiShieldUserLine,
        },

        {
          key: "isPasswordChanged",
          title: "تغيير كلمة المرور",
          content: (
            <BadgeDemo
              type={data.isPasswordChanged ? "TRUE" : "FALSE"}
              text={data.isPasswordChanged ? "تم التغيير" : "لم يتم"}
            />
          ),
          icon: RiShieldUserLine,
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

  const academyTable: DataTableProps<Academy> = {
    data: data.academies,

    headers: [
      {
        key: "id",
        header: "المعرف",
        display: (item) => <ShowMore text={item.id} columns={6} />,
      },
      {
        key: "name",
        header: "اسم الأكاديمية",
        display: (item) => item.name,
      },
      {
        key: "createdAt",
        header: "تاريخ الإنشاء",
        display: (item) => formatDate(item.createdAt, "date"),
      },
    ],
  };

  const jobProfileTable: DataTableProps<JobProfile> = {
    data: data.jobProfile ? [data.jobProfile] : [],

    headers: [
      {
        key: "id",
        header: "المعرف",
        display: (item) => <ShowMore text={item.id} columns={6} />,
      },

      {
        key: "jobProfileType",
        header: "الصلاحية",
        display: (item) => enumTranslations[item.jobProfileType],
      },

      {
        key: "supportType",
        header: "نوع الدعم",
        display: (item) =>
          item.supportType ? enumTranslations[item.supportType] : "-",
      },

      {
        key: "baseSalary",
        header: "الراتب الأساسي",
        display: (item) => item.baseSalary,
      },

      {
        key: "lessonPrice",
        header: "سعر الحصة",
        display: (item) => item.lessonPrice,
      },

      {
        key: "targetCount",
        header: "التارجت",
        display: (item) => item.targetCount,
      },

      {
        key: "bonusAmount",
        header: "البونص",
        display: (item) => item.bonusAmount,
      },

      {
        key: "isActive",
        header: "الحالة",
        display: (item) => (
          <BadgeDemo
            type={item.isActive ? "TRUE" : "FALSE"}
            text={item.isActive ? "نشط" : "غير نشط"}
          />
        ),
      },
      {
        key: "id",
        header: "تفاصيل الملف الوظيفي",
        display: (item) => (
          <Button variant={"link"}>
            <Link to={ROUTE_BUILDERS.jobProfileDetails(item.id)}>التفاصيل</Link>
          </Button>
        ),
      },
    ],
  };

  return (
    <DisplayDetails {...displayConfig}>
      <div className="space-y-6">
        {data.academies.length > 0 && (
          <div className="bg-sidebar rounded-lg p-4 space-y-3">
            <h2 className="text-xl font-bold">الأكاديميات المملوكه</h2>
            <TableUi {...academyTable} />
          </div>
        )}

        {!data.jobProfile && (
          <Button
            variant="outline"
            onClick={handleOpenCreateJobProfile}
            className="h-28 w-full border-dashed border-2 hover:bg-muted transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <RiAddLargeLine className="size-5 text-primary" />
              </div>
              <span className="font-medium">إضافة ملف وظيفي</span>
            </div>
          </Button>
        )}

        {data.jobProfile && (
          <div className="bg-sidebar rounded-lg p-4 space-y-3">
            <h2 className="text-xl font-bold">الملفات الوظيفية</h2>
            <TableUi {...jobProfileTable} />
          </div>
        )}
      </div>
    </DisplayDetails>
  );
}