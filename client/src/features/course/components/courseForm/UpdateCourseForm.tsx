import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import type { Course } from "../../course.type";
import type { UpdateCourseDto } from "../../course.dto";

import { queryKey } from "../../course.constants";

import { updateCourse } from "../../api/course.service";
import { UpdateCourseSchema } from "../../course.schema";

export default function UpdateCourseForm({
  academyId,
  item,
}: {
  academyId: string;
  item: Course;
}) {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<UpdateCourseDto["body"], Course> = {
    defaultValues: {
      name: item.name,
      description: item.description,
      priceOriginal: item.priceOriginal,
      priceDiscounted: item.priceDiscounted,
      requiredInitialDeposit: item.requiredInitialDeposit,
      sessionsBeforeFullPayment: item.sessionsBeforeFullPayment,
      totalSessions: item.totalSessions,
      sessionDurationMinutes: item.sessionDurationMinutes,
      featuredReason: item.featuredReason,
      isActive: item.isActive,
    },

    inputs: [
      {
        name: "name",
        type: "text",
        label: "اسم البرنامج",
      },
      {
        name: "description",
        type: "textarea",
        label: "الوصف",
      },
      {
        name: "priceOriginal",
        type: "number",
        label: "السعر الأصلي",
      },
      {
        name: "priceDiscounted",
        type: "number",
        label: "السعر بعد الخصم",
      },
      {
        name: "requiredInitialDeposit",
        type: "number",
        label: "المقدم",
      },
      {
        name: "sessionsBeforeFullPayment",
        type: "number",
        label: "عدد الحصص قبل السداد",
      },
      {
        name: "totalSessions",
        type: "number",
        label: "عدد الحصص",
      },
      {
        name: "sessionDurationMinutes",
        type: "number",
        label: "مدة الحصة",
      },
      {
        name: "featuredReason",
        type: "text",
        label: "سبب التمييز",
      },
      {
        name: "isActive",
        type: "switch",
        label: "نشط",
      },
    ],

    schema: UpdateCourseSchema.body,

    submitButton: {
      text: "حفظ التعديلات",
      
    },

    service: (body) =>
      updateCourse({
        params: {
          academyId,
          courseId: item.id,
        },
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم تحديث البرنامج");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}