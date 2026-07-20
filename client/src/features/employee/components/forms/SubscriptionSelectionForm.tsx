import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";
import type { ClientSubscriptions } from "@/features/client/client.type";
import AddLessonForm from "@/features/lesson/components/lessonForm/AddLessonForm";
import { useSubscriptionDetails } from "@/features/subscription/api/subscription.query";
import { formatDate } from "@/lib/formatDate";
import { useDialogState } from "@/store/DialogState";
import type { Transmission } from "@/types/enums";
import { useState } from "react";

export default function SubscriptionSelectionForm({
  clientSubscriptions,
  academyId,
  carId,
  startTime,
  gearType,
}: {
  clientSubscriptions: ClientSubscriptions[];
  academyId: string;
  startTime: Date;
  carId: string;
  gearType: Transmission;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const clientSubscriptionsOptions = clientSubscriptions.map((s) => ({
    label: `${s.courseName}-${formatDate(s.createdAt, "date")}`,
    value: s.id,
  }));

  const [subscriptionId, setSubscriptionId] = useState<string>(
    clientSubscriptions.length === 1 ? clientSubscriptions[0].id : "",
  );

  const { data: subscriptionDetails, isLoading } = useSubscriptionDetails(
    academyId,
    subscriptionId,
  );

  const config: FormProps<{ subscriptionId: string }, void> = {
    inputs: [
      {
        name: "subscriptionId",
        type: "select",
        label: "اختار الاشتراك",
        options: clientSubscriptionsOptions,
        placeholder:
          clientSubscriptionsOptions.length === 1
            ? clientSubscriptionsOptions[0].label
            : "اختار الأشتراك",
        onChange(value) {
          setSubscriptionId(value as string);
        },
        disabled: !!subscriptionId,
      },
    ],

    submitButton: {
      text: isLoading ? "جاري التحميل..." : "التالي",
      disabled: isLoading || !subscriptionId,
    },

    onSuccess: (data) => {
      if (!("data" in data)) {
        setConfigDialog({
          title: "إضافة حصة",
          description: "قم بإدخال بيانات الحصة.",
          children: (
            <AddLessonForm
              params={{ academyId }}
              body={{
                subscriptionId: subscriptionDetails?.id ?? "",
                carId,
                startTime,
                transmission: gearType,
                areaId: subscriptionDetails?.areaId ?? "",
                expectedPaymentAmount:
                  subscriptionDetails?.paymentSummary.remainingAmount ?? 0,
              }}
            />
          ),
        });
      }
    },
  };

  return <Form {...config} />;
}