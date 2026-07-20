import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";

import { addCourseFeature } from "../../api/course.service";
import { queryKey } from "../../course.constants";
import { AddCourseFeatureSchema } from "../../course.schema";
import type { AddCourseFeatureDto } from "../../course.dto";
import type { CourseFeature } from "../../course.type";

export default function AddCourseFeatureForm({
  academyId,
  courseId,
}: {
  academyId: string;
  courseId: string;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const config: FormProps<AddCourseFeatureDto["body"], CourseFeature> = {
    inputs: [
      {
        name: "text",
        type: "text",
        label: "الميزة",
        placeholder: "اكتب ميزة البرنامج",
      },
    ],

    schema: AddCourseFeatureSchema.body,

    submitButton: {
      text: "إضافة",
      
    },

    service: (body) =>
      addCourseFeature({
        params: {
          academyId,
          courseId,
        },
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم إضافة الميزة");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}