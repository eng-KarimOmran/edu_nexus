import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import type { ChangeLessonStateDto } from "@/features/lesson/lesson.dto";
import { ChangeLessonStateSchema } from "@/features/lesson/lesson.schema";
import { changeLessonState } from "@/features/lesson/api/lesson.service";

import { queryKey } from "../../../lesson/lesson.constants";
import { LessonStatus } from "@/types/enums";
import type { Lesson as LessonDetails } from "@/features/lesson/lesson.type";
import type { Lesson } from "../../employee.type";

export default function ChangeLessonStateForm({ item }: { item: Lesson }) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const config: FormProps<ChangeLessonStateDto["body"], LessonDetails> = {
    defaultValues: {
      lessonStatus: LessonStatus.COMPLETED,
      amount: item.expectedPaymentAmount,
    },

    inputs:
      item.expectedPaymentAmount > 0
        ? [
            {
              name: "amount",
              type: "number",
              label: "المبلغ المحصل",
            },
          ]
        : [],

    schema: ChangeLessonStateSchema.body,

    submitButton: {
      text: "اكملت الحصة",
    },

    service: (body) =>
      changeLessonState({
        params: {
          academyId: item.academy.id,
          lessonId: item.id,
        },
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("تم تغيير حالة الحصة");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
