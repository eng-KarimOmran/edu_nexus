import Form, { type FormProps } from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";

import { AcademySchema } from "../../academy.schema";
import { queryKey } from "../../academy.constants";
import { addPaymentLink } from "../../api/academy.service";
import type { AddPaymentLinkDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";

export default function AddPaymentLinkForm({
  academyId,
}: {
  academyId: string;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const params: AddPaymentLinkDto["params"] = {
    academyId,
  };

  const config: FormProps<AddPaymentLinkDto["body"], Academy> = {
    inputs: [
      {
        name: "walletProvider",
        type: "text",
        label: "مزود المحفظة",
        placeholder: "مثال: Vodafone Cash",
      },
      {
        name: "url",
        type: "url",
        label: "رابط الدفع",
        placeholder: "https://...",
      },
      {
        name: "phone",
        type: "tel",
        label: "رقم الهاتف (اختياري)",
        placeholder: "01xxxxxxxxx",
      },
    ],

    schema: AcademySchema.paymentLink.add.body,

    submitButton: {
      text: "إضافة رابط الدفع",
    },

    service: (body) =>
      addPaymentLink({
        body,
        params,
      }),

    onSuccess: () => {
      toast.success("تم إضافة رابط الدفع بنجاح");

      queryClient.invalidateQueries({
        queryKey: [...queryKey, academyId],
      });

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}