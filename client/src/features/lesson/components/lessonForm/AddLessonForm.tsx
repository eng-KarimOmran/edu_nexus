import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import { queryKey as queryKeyLesson } from "../../lesson.constants";

import type { Lesson } from "../../lesson.type";
import type { CreateLessonDto } from "../../lesson.dto";

import { createLesson } from "../../api/lesson.service";

import { CreateLessonSchema } from "../../lesson.schema";

import { useCars } from "@/features/car/api/car.query";
import { useAreas } from "@/features/area/api/area.query";
import { useJobProfiles } from "@/features/jobProfile/api/jobProfile.query";

import { transmissionOptions } from "@/lib/enumOptions";
import { useState } from "react";
import { type Transmission } from "@/types/enums";

import { queryKey as queryKeyClient } from "../../../client/client.constants";
import { queryKey as queryKeySubscription } from "../../../subscription/subscription.constants";

import dayjs from "dayjs";

type Props = {
  academyId: string;
  subscriptionId?: string;
  areaId?: string;
};

export default function AddLessonForm({
  academyId,
  subscriptionId,
  areaId,
}: Props) {
  const { setConfigDialog } = useDialogState();
  const [transmission, setTransmission] = useState<Transmission>("AUTOMATIC");

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
  });

  const { data: areas, isLoading: isLoadingAreas } = useAreas({
    page: 1,
    limit: 100,
    isActive: true,
    supportType: transmission,
  });

  const { data: captains, isLoading: isLoadingCaptains } = useJobProfiles({
    page: 1,
    limit: 100,
    isActive: true,
    supportType: transmission,
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
          setTransmission(value as Transmission);
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
        readOnly: !!subscriptionId,
        disabled: !!subscriptionId,
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
      transmission,
      subscriptionId,
      startTime: nextDay,
      areaId,
      expectedPaymentAmount: 0,
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