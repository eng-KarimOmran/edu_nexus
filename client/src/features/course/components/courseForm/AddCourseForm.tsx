import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";
import { useActiveAcademyState } from "@/store/ActiveAcademyState";

import { queryKey } from "../../course.constants";

import type { Course } from "../../course.type";
import type { CreateCourseDto } from "../../course.dto";

import { createCourse } from "../../api/course.service";
import { CreateCourseSchema } from "../../course.schema";

export default function AddCourseForm() {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const academyId = useActiveAcademyState.getState().activeAcademy?.id;

  const config: FormProps<CreateCourseDto["body"], Course> = {
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
        col: "half",
      },
      {
        name: "priceDiscounted",
        type: "number",
        label: "السعر بعد الخصم",
        col: "half",
      },
      {
        name: "requiredInitialDeposit",
        type: "number",
        label: "المقدم",
        col: "half",
      },
      {
        name: "totalSessions",
        type: "number",
        label: "إجمالي عدد الحصص",
        col: "half",
      },
      {
        name: "sessionsBeforeFullPayment",
        type: "number",
        label: "عدد الحصص قبل السداد",
        col: "half",
      },
      {
        name: "sessionDurationMinutes",
        type: "number",
        label: "مدة الحصة (بالدقائق)",
        col: "half",
      },
      {
        name: "featuredReason",
        type: "text",
        label: "سبب التمييز",
      },
    ],

    defaultValues: {
      requiredInitialDeposit: 50,
      sessionDurationMinutes: 50,
    },

    schema: CreateCourseSchema.body,

    submitButton: {
      text: "إضافة البرنامج",
      
    },

    service: (body) =>
      createCourse({
        params: {
          academyId: academyId!,
        },
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم إضافة البرنامج بنجاح");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
