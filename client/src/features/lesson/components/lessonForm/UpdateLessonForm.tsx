import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import { queryKey } from "../../lesson.constants";

import type { Lesson } from "../../lesson.type";
import type { UpdateLessonDto } from "../../lesson.dto";

import { updateLesson } from "../../api/lesson.service";

import { UpdateLessonSchema } from "../../lesson.schema";

import { useCars } from "@/features/car/api/car.query";
import { useAreas } from "@/features/area/api/area.query";
import { useJobProfiles } from "@/features/jobProfile/api/jobProfile.query";

import { transmissionOptions } from "@/lib/enumOptions";

import { JobProfileType, type Transmission } from "@/types/enums";

import { useState } from "react";

export default function UpdateLessonForm({
  academyId,
  item,
}: {
  academyId: string;
  item: Lesson;
}) {
  const { setConfigDialog } = useDialogState();

  const [transmission, setTransmission] = useState<Transmission>(
    item.transmission,
  );

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
    jobProfileType: JobProfileType.CAPTAIN,
    supportType: transmission,
  });

  const config: FormProps<UpdateLessonDto["body"], Lesson> = {
    defaultValues: {
      startTime: new Date(item.startTime),
      transmission: item.transmission,
      expectedPaymentAmount: item.expectedPaymentAmount,
      areaId: item.areaId,
      carId: item.carId,
      jobProfileId: item.jobProfileId,
    },

    inputs: [
      {
        name: "startTime",
        type: "date&time",
        label: "موعد الحصة",
      },

      {
        name: "jobProfileId",
        type: "select",
        label: "الكابتن",
        options:
          captains?.items.map((captain) => ({
            label: captain.user.name,
            value: captain.id,
          })) ?? [],
        disabled: isLoadingCaptains || !captains?.items.length,
      },

      {
        name: "transmission",
        type: "select",
        label: "نوع التدريب",
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
        options:
          cars?.items.map((car) => ({
            label: `${car.modelName} - ${car.plateNumber}`,
            value: car.id,
          })) ?? [],
        disabled: isLoadingCars || !cars?.items.length,
        col: "half",
      },

      {
        name: "areaId",
        type: "select",
        label: "منطقة التدريب",
        options:
          areas?.items.map((area) => ({
            label: area.name,
            value: area.id,
          })) ?? [],
        disabled: isLoadingAreas || !areas?.items.length,
        col: "half",
      },

      {
        name: "expectedPaymentAmount",
        type: "number",
        label: "المبلغ المتوقع",
        col: "half",
      },
    ],

    schema: UpdateLessonSchema.body,

    submitButton: {
      text: "حفظ التعديلات",
    },

    service: (body) =>
      updateLesson({
        params: {
          academyId,
          lessonId: item.id,
        },
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم تحديث الحصة");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
