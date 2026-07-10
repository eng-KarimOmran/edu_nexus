import Form, { type FormProps } from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";

import { AcademySchema } from "../../academy.schema";
import { queryKey } from "../../academy.constants";
import { addRule } from "../../api/academy.service";
import type { AddRuleDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";

export default function AddRuleForm({ academyId }: { academyId: string }) {
  const { setConfigDialog } = useDialogState();

  const params: AddRuleDto["params"] = {
    academyId,
  };

  const config: FormProps<AddRuleDto["body"], Academy> = {
    inputs: [
      {
        name: "content",
        type: "textarea",
        label: "القاعدة",
        placeholder: "اكتب القاعدة",
      },
    ],

    schema: AcademySchema.rule.add.body,

    submitButton: {
      text: "إضافة القاعدة",
    },

    service: (body) =>
      addRule({
        body,
        params,
      }),

    onSuccess: () => {
      toast.success("تم إضافة القاعدة بنجاح");
      queryClient.invalidateQueries({
        queryKey: [...queryKey, academyId],
      });
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
