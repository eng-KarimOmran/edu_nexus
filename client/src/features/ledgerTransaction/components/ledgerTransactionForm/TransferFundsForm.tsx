import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";

import { queryKey as queryKeyLedgerTransaction } from "../../ledgerTransaction.constants";
import { queryKey as queryKeyAcademy } from "../../../academy/academy.constants";
import { queryKey as queryKeyJobProfile } from "../../../jobProfile/jobProfile.constants";

import { transferFunds } from "../../api/ledgerTransaction.service";
import type { TransferFundsDto } from "../../ledgerTransaction.dto";
import { TransferFundsSchema } from "../../ledgerTransaction.schema";
import type { WalletMovement } from "../../ledgerTransaction.type";
import { transactionTypeOptions } from "@/lib/enumOptions";

export default function TransferFundsForm({
  academyId,
  receiverWalletId,
  amount,
}: {
  academyId: string;
  receiverWalletId: string;
  amount?: number;
}) {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<TransferFundsDto["body"], WalletMovement> = {
    inputs: [
      {
        name: "amount",
        type: "number",
        label: "المبلغ",
        placeholder: "مثال: 500",
        col: "half",
      },
      {
        name: "transactionType",
        type: "select",
        label: "النوع",
        placeholder: "اختار نوع التحويل",
        options: transactionTypeOptions,
        col: "half",
      },
    ],

    defaultValues: {
      receiverWalletId,
      amount: amount ?? 500,
      transactionType: "EMPLOYEE_TRANSFER_TO_EMPLOYEE",
    },

    schema: TransferFundsSchema.body,

    submitButton: {
      text: "تحويل",
    },

    service: async (body) => {
      if (!academyId) throw Error("معرف الأكاديمية مطلوب");
      return transferFunds({
        params: { academyId },
        body,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyLedgerTransaction });
      queryClient.invalidateQueries({ queryKey: queryKeyAcademy });
      queryClient.invalidateQueries({ queryKey: queryKeyJobProfile });
      toast.success("تم التحويل بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
