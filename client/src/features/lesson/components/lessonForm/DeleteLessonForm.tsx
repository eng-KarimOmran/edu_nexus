import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { matchSchema } from "@/lib/matchSchema";

import { useDialogState } from "@/store/DialogState";

import { deleteLesson } from "../../api/lesson.service";

import { queryKey } from "../../lesson.constants";

import type { Lesson } from "../../lesson.type";

export default function DeleteLessonForm({
  academyId,
  item,
}: {
  academyId: string;
  item: Lesson;
}) {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<{ text: string }, Lesson> = {
    inputs: [
      {
        name: "text",
        type: "text",
        label: `اكتب "حذف" لتأكيد الحذف`,
        placeholder: "اكتب حذف للتأكيد",
      },
    ],

    schema: matchSchema("text", "حذف", "حذف"),

    submitButton: {
      text: "حذف الحصة",
      variant: "destructive",
    },

    service: () =>
      deleteLesson({
        params: {
          academyId,
          lessonId: item.id,
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم حذف الحصة بنجاح");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}