import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import type { WalletMovement } from "../../ledgerTransaction.type";

import type { ChangeLedgerTransactionStatusDto } from "../../ledgerTransaction.dto";

import { changeLedgerTransactionStatus } from "../../api/ledgerTransaction.service";

import { ChangeLedgerTransactionStatusSchema } from "../../ledgerTransaction.schema";

import type { WalletMovementStatus } from "@/types/enums";

import { queryKey as queryKeyLedgerTransaction } from "../../ledgerTransaction.constants";
import { queryKey as queryKeyClient } from "../../../client/client.constants";
import { queryKey as queryKeySubscription } from "../../../subscription/subscription.constants";
import { queryKey as queryKeyAcademy } from "../../../academy/academy.constants";

type Props = {
  academyId: string;
  ledgerTransactionId: string;
  status: WalletMovementStatus;
};

export default function ChangeWalletMovementStatusForm({
  academyId,
  ledgerTransactionId,
  status,
}: Props) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const config: FormProps<
    ChangeLedgerTransactionStatusDto["body"],
    WalletMovement
  > = {
    defaultValues: {
      walletMovementStatus: status,
    },

    inputs: [],

    schema: ChangeLedgerTransactionStatusSchema.body,

    submitButton: {
      text: "تأكيد",
    },

    service: (body) =>
      changeLedgerTransactionStatus({
        params: {
          academyId,
          ledgerTransactionId,
        },
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyLedgerTransaction });
      queryClient.invalidateQueries({ queryKey: queryKeyClient });
      queryClient.invalidateQueries({ queryKey: queryKeySubscription });
      queryClient.invalidateQueries({ queryKey: queryKeyAcademy });
      toast.success("تم تحديث الحالة بنجاح");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
