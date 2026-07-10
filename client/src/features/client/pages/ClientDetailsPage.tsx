import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import EmptyState from "@/components/EmptyState/EmptyState";

import displayError from "@/lib/displayError";

import { useClientDetails } from "../api/client.query";

import {
  RiFingerprint2Line,
  RiIssuesLine,
  RiLink,
  RiPhoneFill,
  RiSchoolFill,
  RiUserLine,
  RiWallet3Line,
} from "@remixicon/react";

import type { DisplayDetailsProps } from "@/components/DisplayDetails/DisplayDetails";

import DisplayDetails from "@/components/DisplayDetails/DisplayDetails";

import { enumTranslations } from "@/lib/enumTranslations";

import { formatDate } from "@/lib/formatDate";

import {
  GetContactLink,
  GetWhatsappLink,
} from "@/components/GetPhoneLinks/GetPhoneLinks";

import type { OtherFile } from "../client.type";

import type { DataTableProps } from "@/components/Table/TableUi";

import TableUi from "@/components/Table/TableUi";

import { Button } from "@/components/ui/button";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";
import type { ErrorResponse } from "@/types/axios";

import type { Subscription } from "@/features/subscription/subscription.type";
import { columns } from "@/features/subscription/config/subscription.columns";
import AddSubscriptionForm from "@/features/subscription/components/subscriptionForm/AddSubscriptionForm";
import { sendClientTrackingInfo } from "../config/client.utility";

export default function ClientDetailsPage() {
  const { academyId, clientId } = useParams();

  const navigate = useNavigate();

  const { data, error, isLoading } = useClientDetails(academyId, {
    clientId,
  });

  useEffect(() => {
    if (error) {
      const err = error as ErrorResponse;
      displayError({
        error,
        mes: "حدث خطأ أثناء تحميل بيانات العميل.",
      });

      if (err.response?.status === 403) {
        navigate(-1);
      }
    }
  }, [error, navigate]);

  if (isLoading) {
    return <div className="space-y-4">loading...</div>;
  }

  if (!data) {
    return <EmptyState message="العميل غير موجود." />;
  }

  const { currentClient, otherFiles } = data;

  const subscriptions = currentClient.subscriptions;

  const balance = currentClient?.wallet.balance ?? 0;

  const otherFilesTable: DataTableProps<OtherFile> = {
    headers: [
      {
        key: "name",
        header: "اسم الأكاديمية",
        display: (data) => data.academy.name,
      },
      {
        key: "name",
        header: "اسم العميل",
        display: (data) => data.name,
      },
      {
        key: "name",
        header: "رقم هاتف االعميل",
        display: (data) => data.phone,
      },
      {
        key: "academyId",
        header: "الأنتقال الى ملف العميل",
        display: (data) => (
          <Button variant={"link"} asChild>
            <Link to={ROUTE_BUILDERS.clientDetails(data.academyId, data.id)}>
              <RiLink />
              ملف العميل
            </Link>
          </Button>
        ),
      },
    ],
    data: otherFiles,
  };

  const subscriptionsTable: DataTableProps<Subscription> = {
    headers: [
      ...columns,
      {
        key: "academyId",
        header: "تفاصيل الأشتركات",
        display: (data) => (
          <Button variant={"link"} asChild>
            <Link
              to={ROUTE_BUILDERS.subscriptionDetails(data.academyId, data.id)}
            >
              <RiLink />
              تفاصيل الأشتركات
            </Link>
          </Button>
        ),
      },
    ],
    data: subscriptions,
    ButtonAddTable: {
      configDialog: {
        title: "إضافة اشتراك",
        description: "إنشاء اشتراك جديد لهذا العميل.",
        children: (
          <AddSubscriptionForm
            academyId={data.currentClient.academyId}
            clientId={data.currentClient.id}
          />
        ),
      },
    },
  };
  
  const displayConfig: DisplayDetailsProps = {
    header: {
      title: currentClient.name,
      actions: (
        <div className="flex items-center gap-2">
          <GetContactLink phone={currentClient.phone} />
          <GetWhatsappLink phone={currentClient.phone} />
          <Button
            disabled={!data.currentClient.academy.profileTrackingUrl}
            onClick={() => sendClientTrackingInfo(data.currentClient)}
          >
            إرسال رابط المتابعة
          </Button>
        </div>
      ),
    },
    basicInfo: {
      title: "بيانات العميل",
      data: [
        {
          key: "academy.name",
          title: "الأكاديمية",
          content: currentClient.academy.name,
          icon: RiSchoolFill,
        },
        {
          key: "name",
          title: "اسم العميل",
          content: currentClient.name,
          icon: RiUserLine,
        },
        {
          key: "phone",
          title: "رقم العميل",
          content: currentClient.phone,
          icon: RiPhoneFill,
          copyButton: true,
        },
        {
          key: "source",
          title: "انضم عن طريق",
          content: enumTranslations[currentClient.source],
          icon: RiIssuesLine,
        },
        {
          key: "id",
          title: "معرف العميل",
          content: currentClient.id,
          icon: RiFingerprint2Line,
          copyButton: true,
        },
        {
          key: "balance",
          title: "مديونية العميل",
          content: <span className="text-red-500">{Math.abs(balance)}</span>,
          icon: RiWallet3Line,
        },
        {
          key: "createdAt",
          title: "تاريخ الأنضمام",
          content: formatDate(currentClient.createdAt, "date").toString(),
          icon: RiIssuesLine,
        },
      ],
    },
  };

  return (
    <DisplayDetails {...displayConfig}>
      <div className="bg-sidebar p-4 rounded-lg space-y-3">
        <h2 className="text-xl font-bold">الأشتركات</h2>
        <TableUi {...subscriptionsTable} />
      </div>
      <div className="bg-sidebar p-4 rounded-lg space-y-3">
        <h2 className="text-xl font-bold">الملفات الأخرى</h2>
        <TableUi {...otherFilesTable} />
      </div>
    </DisplayDetails>
  );
}
