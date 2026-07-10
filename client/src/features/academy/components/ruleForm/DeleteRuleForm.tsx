import Form, { type FormProps } from "@/components/Form/Form";
import { matchSchema } from "@/lib/matchSchema";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";

import { queryKey } from "../../academy.constants";
import { deleteRule } from "../../api/academy.service";
import type { DeleteRuleDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";

export default function DeleteRuleForm({
  academyId,
  ruleId,
}: {
  academyId: string;
  ruleId: string;
}) {
  const { setConfigDialog } = useDialogState();

  const params: DeleteRuleDto["params"] = {
    academyId,
    ruleId,
  };

  const config: FormProps<{ text: string }, Academy> = {
    inputs: [
      {
        name: "text",
        type: "text",
        label: "اكتب ( حذف ) لتأكيد الحذف",
        placeholder: "اكتب حذف",
      },
    ],

    schema: matchSchema("text", "كلمة التأكيد", "حذف"),

    submitButton: {
      text: "حذف",
      variant: "destructive",
    },

    service: () =>
      deleteRule({
        params,
      }),

    onSuccess: () => {
      toast.success("تم حذف القاعدة بنجاح");

      queryClient.invalidateQueries({
        queryKey: [...queryKey, academyId],
      });

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
