import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { matchSchema } from "@/lib/matchSchema";

import { useDialogState } from "@/store/DialogState";

import { deleteLedgerTransaction } from "../../api/ledgerTransaction.service";
import { queryKey as queryKeyTransaction } from "../../ledgerTransaction.constants";
import {  queryKey as queryKeySubscription } from "../../../subscription/subscription.constants";
import type { WalletMovement } from "../../ledgerTransaction.type";

export default function DeleteLedgerTransactionForm({
  academyId,
  item,
}: {
  academyId: string;
  item: WalletMovement;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const config: FormProps<{ text: string }, WalletMovement> = {
    inputs: [
      {
        name: "text",
        type: "text",
        label: 'اكتب "حذف" لتأكيد الحذف',
        placeholder: "اكتب حذف للتأكيد",
      },
    ],

    schema: matchSchema("text", "حذف", "حذف"),

    submitButton: {
      text: "حذف الحركة المالية",
      variant: "destructive",
    },

    service: () =>
      deleteLedgerTransaction({
        params: {
          academyId,
          walletMovementId: item.id,
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:queryKeyTransaction});
      queryClient.invalidateQueries({queryKey:queryKeySubscription});

      toast.success("تم حذف الحركة المالية بنجاح");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}