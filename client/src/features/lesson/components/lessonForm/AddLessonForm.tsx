import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import type { Lesson } from "../../lesson.type";
import type { CreateLessonDto } from "../../lesson.dto";

import { createLesson } from "../../api/lesson.service";

import { CreateLessonSchema } from "../../lesson.schema";

import { useCars } from "@/features/car/api/car.query";
import { useAreas } from "@/features/area/api/area.query";
import { useJobProfiles } from "@/features/jobProfile/api/jobProfile.query";

import { transmissionOptions } from "@/lib/enumOptions";
import { useState } from "react";

import { queryKey as queryKeyLesson } from "../../lesson.constants";
import { queryKey as queryKeyClient } from "../../../client/client.constants";
import { queryKey as queryKeySubscription } from "../../../subscription/subscription.constants";

import dayjs from "dayjs";
import type { Transmission } from "@/types/enums";

type Props = {
  body?: Partial<CreateLessonDto["body"]>;
  params: CreateLessonDto["params"];
};

export default function AddLessonForm({ body, params }: Props) {
  const { setConfigDialog } = useDialogState();
  const { academyId } = params;

  const [transmissionLesson, setTransmissionLesson] = useState<Transmission>(
    !body?.transmission || body.transmission === "BOTH"
      ? "AUTOMATIC"
      : body.transmission,
  );

  const nextDay = dayjs()
    .add(1, "day")
    .hour(12)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate();

  const { data: cars, isLoading: isLoadingCars } = useCars({
    page: 1,
    limit: 100,
    isActive: true,
    gearType: transmissionLesson,
  });

  const { data: areas, isLoading: isLoadingAreas } = useAreas({
    page: 1,
    limit: 100,
    isActive: true,
    supportType: transmissionLesson,
  });

  const { data: captains, isLoading: isLoadingCaptains } = useJobProfiles({
    page: 1,
    limit: 100,
    isActive: true,
    supportType: transmissionLesson,
  });

  const config: FormProps<CreateLessonDto["body"], Lesson> = {
    inputs: [
      {
        name: "startTime",
        type: "date&time",
        label: "موعد الحصة",
      },

      {
        name: "transmission",
        type: "select",
        label: "نوع الحصة",
        options: transmissionOptions,
        onChange(value) {
          setTransmissionLesson(value as Transmission);
        },
        col: "half",
      },

      {
        name: "carId",
        type: "select",
        label: "السيارة",

        placeholder: isLoadingCars
          ? "جاري تحميل السيارات"
          : cars?.items.length
            ? "اختار سيارة"
            : "لا يوجد سيارات",

        options:
          cars?.items.map((car) => ({
            label: `${car.modelName} - ${car.plateNumber}`,
            value: car.id,
          })) ?? [],
        col: "half",

        disabled: isLoadingCars || !cars?.items.length,
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
          areas?.items.map((area) => ({
            label: area.name,
            value: area.id,
          })) ?? [],
        disabled: isLoadingAreas || !areas?.items.length,
        col: "half",
      },

      {
        name: "jobProfileId",
        type: "select",
        label: "الكابتن",

        placeholder: isLoadingCaptains
          ? "جاري تحميل المدربين"
          : captains?.items.length
            ? "اختار مدرب"
            : "لا يوجد مدربين",
        col: "half",
        options:
          captains?.items.map((captain) => ({
            label: captain.user.name,
            value: captain.id,
          })) ?? [],
        disabled: isLoadingCaptains || !captains?.items.length,
      },

      {
        name: "subscriptionId",
        type: "text",
        label: "معرف الاشتراك",
        placeholder: "أدخل معرف الاشتراك",
        readOnly: !!body?.subscriptionId,
        disabled: !!body?.subscriptionId,
        col: "half",
      },

      {
        name: "expectedPaymentAmount",
        type: "number",
        label: "المبلغ المتوقع",
        col: "half",
      },
    ],

    schema: CreateLessonSchema.body,

    defaultValues: {
      transmission: transmissionLesson,
      subscriptionId: body?.subscriptionId ?? "",
      startTime: nextDay,
      areaId: body?.areaId ?? "",
      expectedPaymentAmount: body?.expectedPaymentAmount ?? 0,
    },

    submitButton: {
      text: "إضافة الحصة",
    },

    service: (body) =>
      createLesson({
        params: {
          academyId,
        },
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyLesson });
      queryClient.invalidateQueries({ queryKey: queryKeyClient });
      queryClient.invalidateQueries({ queryKey: queryKeySubscription });

      toast.success("تم إنشاء الحصة بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
