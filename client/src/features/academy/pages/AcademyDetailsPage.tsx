import { useParams } from "react-router-dom";
import { useAcademyDetails } from "../api/academy.query";
import { useEffect } from "react";
import EmptyState from "@/components/EmptyState/EmptyState";
import { formatDate } from "@/lib/formatDate";

import {
  RiCalendar2Fill,
  RiFingerprint2Line,
  RiSchoolLine,
  RiWallet3Line,
} from "@remixicon/react";

import DisplayArray from "@/components/DisplayArray/DisplayArray";
import AddOwnerForm from "../components/ownerForm/AddOwner";
import DeleteOwnerForm from "../components/ownerForm/DeleteOwner";
import { enumTranslations } from "@/lib/enumTranslations";
import AddSocialMediaForm from "../components/socialMediaForm/AddSocialMedia";
import DeleteSocialMediaForm from "../components/socialMediaForm/DeleteSocialMedia";
import AddPhoneForm from "../components/phoneForm/AddPhoneForm";
import DeletePhoneForm from "../components/phoneForm/DeletePhoneForm";
import AddAddressForm from "../components/addressForm/AddAddressForm";
import DeleteAddressForm from "../components/addressForm/DeleteAddressForm";
import AddPaymentLinkForm from "../components/paymentLinkForm/AddPaymentLinkForm";
import DeletePaymentLinkForm from "../components/paymentLinkForm/DeletePaymentLinkForm";
import {
  LoadingCards,
  LoadingCharts,
  SkeletonGrid,
} from "@/components/Loading/Loading";
import displayError from "@/lib/displayError";
import DisplayDetails, {
  type DisplayDetailsProps,
} from "@/components/DisplayDetails/DisplayDetails";
import AddRuleForm from "../components/ruleForm/AddRuleForm";
import DeleteRuleForm from "../components/ruleForm/DeleteRuleForm";

export default function AcademyDetailsPage() {
  const { academyId } = useParams();

  const { isLoading, error, data } = useAcademyDetails({ academyId });

  useEffect(() => {
    if (error) {
      displayError({ error, mes: "حدث خطأ اثناء تحميل الأكاديمية" });
    }
  }, [error]);

  if (isLoading)
    return (
      <div className="space-y-6">
        <SkeletonGrid height="h-20" count={1} />
        <LoadingCards count={3} />
        <LoadingCharts count={4} />
      </div>
    );

  if (!data) {
    return <EmptyState message="الأكاديمية غير موجوده" />;
  }

  const balance = data.wallet.length > 0 ? data.wallet[0].balance : 0;

  const displayConfig: DisplayDetailsProps = {
    header: {
      title: data.name,
    },

    basicInfo: {
      title: "البيانات الأساسية للأكاديمية",

      data: [
        {
          key: "id",
          title: "معرف الأكاديمية",
          content: data.id,
          icon: RiFingerprint2Line,
          copyButton: true,
        },

        {
          key: "name",
          title: "اسم الأكاديمية",
          content: data.name,
          icon: RiSchoolLine,
        },

        {
          key: "balance",
          title: "رصيد الأكاديمية",
          content: <span className="text-yellow-500">{balance}</span>,
          icon: RiWallet3Line,
        },

        {
          key: "createdAt",
          title: "تاريخ الإنشاء",
          content: formatDate(data.createdAt, "date").toString(),
          icon: RiCalendar2Fill,
        },
      ],
    },
  };

  return (
    <DisplayDetails {...displayConfig}>
      <div className="flex flex-wrap gap-4">
        <div className="w-full lg:w-[calc(50%-16px)]">
          <DisplayArray
            title="المالكين"
            data={data.owners}
            titleKey="name"
            descKey="phone"
            forms={{
              add: () => (
                <AddOwnerForm
                  ownersId={data.owners.map((o) => o.id)}
                  academyId={data.id}
                />
              ),
              delete: (item) => (
                <DeleteOwnerForm
                  phone={item.phone}
                  academyId={data.id}
                  ownerId={item.id}
                />
              ),
            }}
          />

          <DisplayArray
            title="أرقام الهاتف"
            data={data.academyPhones}
            titleKey="phone"
            forms={{
              add: () => <AddPhoneForm academyId={data.id} />,
              delete: (item) => (
                <DeletePhoneForm academyId={data.id} phoneId={item.id} />
              ),
            }}
          />

          <DisplayArray
            title="العناوين"
            data={data.addresses}
            titleKey="address"
            forms={{
              add: () => <AddAddressForm academyId={data.id} />,
              delete: (item) => (
                <DeleteAddressForm academyId={data.id} addressId={item.id} />
              ),
            }}
          />

          <DisplayArray
            title="روابط الدفع"
            data={data.paymentLinks}
            titleKey="walletProvider"
            descKey="url"
            forms={{
              add: () => <AddPaymentLinkForm academyId={data.id} />,
              delete: (item) => (
                <DeletePaymentLinkForm
                  academyId={data.id}
                  paymentLinkId={item.id}
                />
              ),
            }}
          />

          <DisplayArray
            title="وسائل التواصل الاجتماعي"
            data={data.socialMedia.map((s) => {
              const { platform, ...rest } = s;

              return {
                platform: enumTranslations[platform],
                ...rest,
              };
            })}
            titleKey="platform"
            descKey="url"
            forms={{
              add: () => <AddSocialMediaForm academyId={data.id} />,
              delete: (item) => (
                <DeleteSocialMediaForm
                  academyId={data.id}
                  socialMediaId={item.id}
                />
              ),
            }}
          />

          <DisplayArray
            title="القواعد"
            data={data.academyRules}
            titleKey="content"
            forms={{
              add: () => <AddRuleForm academyId={data.id} />,
              delete: (item) => (
                <DeleteRuleForm academyId={data.id} ruleId={item.id} />
              ),
            }}
          />
        </div>
      </div>
    </DisplayDetails>
  );
}
