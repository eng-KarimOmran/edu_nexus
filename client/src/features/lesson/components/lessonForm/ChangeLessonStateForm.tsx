import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import { queryKey as queryKeyLesson } from "../../lesson.constants";
import { queryKey as queryKeyClient } from "../../../client/client.constants";
import { queryKey as queryKeySubscription } from "../../../subscription/subscription.constants";

import type { Lesson } from "../../lesson.type";

import type { ChangeLessonStateDto } from "../../lesson.dto";

import { changeLessonState } from "../../api/lesson.service";

import { ChangeLessonStateSchema } from "../../lesson.schema";

import { lessonStatusOptions } from "@/lib/enumOptions";

export default function ChangeLessonStateForm({ item }: { item: Lesson }) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

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
          academyId: item.academyId,
          lessonId: item.id,
        },
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyLesson });
      queryClient.invalidateQueries({ queryKey: queryKeyClient });
      queryClient.invalidateQueries({ queryKey: queryKeySubscription });

      toast.success("تم تغيير حالة الحصة");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
