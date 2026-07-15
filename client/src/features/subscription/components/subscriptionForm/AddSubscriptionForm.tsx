import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import { queryKey as queryKeySubscription } from "../../subscription.constants";

import { queryKey as queryKeyClient } from "../../../client/client.constants";

import { createSubscription } from "../../api/subscription.service";

import { CreateSubscriptionSchema } from "../../subscription.schema";

import type { CreateSubscriptionDto } from "../../subscription.dto";

import type { Subscription } from "../../subscription.type";
import { useCourses } from "@/features/course/api/course.query";
import { useAreas } from "@/features/area/api/area.query";
import { enumTranslations } from "@/lib/enumTranslations";
import { SupportType } from "@/types/enums";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";
import { useNavigate } from "react-router-dom";

type Props = {
  academyId: string;
  clientId?: string;
};

export default function AddSubscriptionForm({ academyId, clientId }: Props) {
  const { setConfigDialog } = useDialogState();
  const navigate = useNavigate();

  const { data: courses, isLoading: isLoadingCourses } = useCourses({
    academyId,
    query: { limit: 100, page: 1, isActive: true },
  });

  const { data: areas, isLoading: isLoadingAreas } = useAreas({
    limit: 100,
    page: 1,
    isActive: true,
  });

  const config: FormProps<CreateSubscriptionDto["body"], Subscription> = {
    defaultValues: {
      clientId: clientId ?? "",
    },

    inputs: [
      {
        name: "clientId",
        type: "text",
        label: "معرف العميل",
        disabled: !!clientId,
        readOnly: !!clientId,
      },

      {
        name: "courseId",
        type: "select",
        label: "البرنامج",
        placeholder: isLoadingCourses
          ? "جاري تحميل البرامج"
          : courses?.items
            ? "اختار برنامج"
            : "لايوجد برامج",
        options:
          courses?.items.map((item) => ({
            label: item.name,
            value: item.id,
          })) ?? [],
        disabled: isLoadingCourses || !courses?.items.length,
      },

      {
        name: "areaId",
        type: "select",
        label: "منطقة التدريب",
        placeholder: isLoadingAreas
          ? "جاري تحميل المناطق"
          : areas?.items.length
            ? "اختار منطقة"
            : "لا يوجد مناطق",
        options:
          areas?.items.map((item) => ({
            label: item.name,
            value: item.id,
          })) ?? [],
        disabled: isLoadingAreas || !areas?.items.length,
        col: "half",
      },

      {
        name: "trainingTypeAtRegistration",
        type: "select",
        label: "نوع التدريب",

        options: [
          {
            label: enumTranslations[SupportType.MANUAL],
            value: SupportType.MANUAL,
          },
          {
            label: enumTranslations[SupportType.AUTOMATIC],
            value: SupportType.AUTOMATIC,
          },
          {
            label: enumTranslations[SupportType.BOTH],
            value: SupportType.BOTH,
          },
        ],
        col: "half",
      },
    ],

    schema: CreateSubscriptionSchema.body,

    submitButton: {
      text: "إنشاء الاشتراك",
    },

    service: (body) =>
      createSubscription({
        params: {
          academyId,
        },

        body: {
          ...body,

          clientId: clientId ?? body.clientId,
        },
      }),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeySubscription });
      queryClient.invalidateQueries({ queryKey: queryKeyClient });
      toast.success("تم إنشاء الاشتراك بنجاح");
      setConfigDialog(null);
      if ("data" in data) {
        navigate(ROUTE_BUILDERS.subscriptionDetails(data.data.academyId, data.data.id));
      }
    },
  };

  return <Form {...config} />;
}
