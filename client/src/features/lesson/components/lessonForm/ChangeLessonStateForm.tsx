import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import { queryKey } from "../../lesson.constants";

import type { Lesson } from "../../lesson.type";

import type { ChangeLessonStateDto } from "../../lesson.dto";

import { changeLessonState } from "../../api/lesson.service";

import { ChangeLessonStateSchema } from "../../lesson.schema";

import { lessonStatusOptions } from "@/lib/enumOptions";

export default function ChangeLessonStateForm({
  academyId,
  item,
}: {
  academyId: string;
  item: Lesson;
}) {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<ChangeLessonStateDto["body"], Lesson> = {
    defaultValues: {
      lessonStatus: item.lessonStatus,
      amount: 0,
    },

    inputs: [
      {
        name: "lessonStatus",
        type: "select",
        label: "الحالة",

        options: lessonStatusOptions,
      },

      {
        name: "amount",
        type: "number",
        label: "المبلغ المحصل",
        placeholder: "اختياري",
      },
    ],

    schema: ChangeLessonStateSchema.body,

    submitButton: {
      text: "حفظ",
    },

    service: (body) =>
      changeLessonState({
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

      toast.success("تم تغيير حالة الحصة");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
