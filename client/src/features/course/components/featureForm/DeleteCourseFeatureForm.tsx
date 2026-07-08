import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";

import { matchSchema } from "@/lib/matchSchema";

import { deleteCourseFeature } from "../../api/course.service";
import { queryKey } from "../../course.constants";

export default function DeleteCourseFeatureForm({
  academyId,
  courseId,
  featureId,
  feature,
}: {
  academyId: string;
  courseId: string;
  featureId: string;
  feature: string;
}) {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<{ feature: string }, unknown> = {
    inputs: [
      {
        name: "feature",
        type: "text",
        label: `اكتب "${feature}" للتأكيد`,
      },
    ],

    schema: matchSchema("feature", "الميزة", feature),

    submitButton: {
      text: "حذف",
      
      variant: "destructive",
    },

    service: () =>
      deleteCourseFeature({
        params: {
          academyId,
          courseId,
          featureId,
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم حذف الميزة");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
