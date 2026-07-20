import Form, { type FormProps } from "@/components/Form/Form";
import { matchSchema } from "@/lib/matchSchema";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";

import { queryKey } from "../../academy.constants";
import { deletePaymentLink } from "../../api/academy.service";
import type { DeletePaymentLinkDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";

export default function DeletePaymentLinkForm({
  academyId,
  paymentLinkId,
}: {
  academyId: string;
  paymentLinkId: string;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const params: DeletePaymentLinkDto["params"] = {
    academyId,
    paymentLinkId,
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
      deletePaymentLink({
        params,
      }),

    onSuccess: () => {
      toast.success("تم حذف رابط الدفع بنجاح");

      queryClient.invalidateQueries({
        queryKey: [...queryKey, academyId],
      });

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}