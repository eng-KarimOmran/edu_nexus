import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";

import { queryKey as queryKeyJobProfile } from "../../jobProfile.constants";
import { queryKey as queryKeyUser } from "../../../user/user.constants";

import type { CreateJobProfileDto } from "../../jobProfile.dto";
import type { JobProfile } from "../../jobProfile.type";

import { createJobProfile } from "../../api/jobProfile.service";
import { jobProfileTypeOptions, supportTypeOptions } from "@/lib/enumOptions";
import { createJobProfileSchema } from "../../jobProfile.schema";

export default function AddJobProfileForm({ userId }: { userId?: string }) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const config: FormProps<CreateJobProfileDto["body"], JobProfile> = {
    inputs: [
      {
        name: "userId",
        type: "text",
        label: "الموظف",
        placeholder: "معرف الموظف",
        col: "full",
        disabled: !!userId,
        readOnly: !!userId,
      },
      {
        name: "jobProfileType",
        type: "select",
        label: "الصلاحية",
        options: jobProfileTypeOptions,
        col: "half",
      },
      {
        name: "supportType",
        type: "select",
        label: "نوع الدعم",
        options: supportTypeOptions,
        col: "half",
      },
      {
        name: "baseSalary",
        type: "number",
        label: "الراتب الأساسي",
        col: "half",
      },
      {
        name: "lessonPrice",
        type: "number",
        label: "سعر الحصة",
        col: "half",
      },
      {
        name: "targetCount",
        type: "number",
        label: "التارجت",
        col: "half",
      },
      {
        name: "bonusAmount",
        type: "number",
        label: "المكافأة",
        col: "half",
      },
    ],

    schema: createJobProfileSchema.body,

    defaultValues: {
      userId: userId ?? "",
    },

    submitButton: {
      text: "إضافة الوظيفة",
    },

    service: (body) =>
      createJobProfile({
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyJobProfile });
      queryClient.invalidateQueries({ queryKey: queryKeyUser });
      toast.success("تم إضافة الوظيفة بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
