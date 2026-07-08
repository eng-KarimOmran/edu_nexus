import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { matchSchema } from "@/lib/matchSchema";

import { useDialogState } from "@/store/DialogState";

import { deleteCourse } from "../../api/course.service";

import type { Course } from "../../course.type";

import { queryKey } from "../../course.constants";

export default function DeleteCourseForm({
  academyId,
  item,
}: {
  academyId: string;
  item: Course;
}) {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<{ name: string }, Course> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: `اكتب "${item.name}" للتأكيد`,
      },
    ],

    schema: matchSchema("name", "اسم البرنامج", item.name),

    submitButton: {
      text: "حذف البرنامج",
      
      variant: "destructive",
    },

    service: () =>
      deleteCourse({
        params: {
          academyId,
          courseId: item.id,
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم حذف البرنامج");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
