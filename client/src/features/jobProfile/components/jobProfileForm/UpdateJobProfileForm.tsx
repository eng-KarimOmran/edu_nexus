import Form, { type FormProps } from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";

import { queryKey } from "../../jobProfile.constants";

import type { JobProfile } from "../../jobProfile.type";
import type { UpdateJobProfileDto } from "../../jobProfile.dto";

import { updateJobProfile } from "../../api/jobProfile.service";
import { jobProfileTypeOptions, supportTypeOptions } from "@/lib/enumOptions";
import { updateJobProfileSchema } from "../../jobProfile.schema";

export default function UpdateJobProfileForm({ item }: { item: JobProfile }) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const params: UpdateJobProfileDto["params"] = {
    jobProfileId: item.id,
  };

  const config: FormProps<UpdateJobProfileDto["body"], JobProfile> = {
    defaultValues: {
      jobProfileType: item.jobProfileType,
      supportType: item.supportType ?? undefined,
      isActive: item.isActive,
      baseSalary: item.baseSalary,
      lessonPrice: item.lessonPrice,
      targetCount: item.targetCount,
      bonusAmount: item.bonusAmount,
    },

    inputs: [
      {
        name: "isActive",
        type: "switch",
        label: "نشط",
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

    schema: updateJobProfileSchema.body,

    submitButton: {
      text: "حفظ التعديلات",
    },

    service: (body) =>
      updateJobProfile({
        params,
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("تم تحديث الوظيفة بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
