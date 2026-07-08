import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";

import {
  paymentMethodOptions,
  transactionTypeOptions,
} from "@/lib/enumOptions";

import { queryKey as queryKeyLedgerTransaction } from "../../ledgerTransaction.constants";
import { queryKey as queryKeyClient } from "../../../client/client.constants";
import { queryKey as queryKeySubscription } from "../../../subscription/subscription.constants";
import { queryKey as queryKeyAcademy } from "../../../academy/academy.constants";

import { createLedgerTransaction } from "../../api/ledgerTransaction.service";
import type { ProcessPaymentTransactionSchemaDto } from "../../ledgerTransaction.dto";
import { processPaymentTransactionSchema } from "../../ledgerTransaction.schema";
import { uploadImage } from "@/service/upload.service";
import { useState } from "react";
import { PaymentMethod } from "@/types/enums";
import type { WalletMovement } from "../../ledgerTransaction.type";

export default function AddLedgerTransactionForm({
  academyId,
  subscriptionId,
}: {
  academyId: string;
  subscriptionId?: string;
}) {
  const { setConfigDialog } = useDialogState();
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("ELECTRONIC");

  const config: FormProps<
    ProcessPaymentTransactionSchemaDto["body"],
    WalletMovement
  > = {
    inputs: [
      {
        name: "subscriptionId",
        type: "text",
        label: "الاشتراك",
        readOnly: !!subscriptionId,
        disabled: !!subscriptionId,
      },
      {
        name: "transactionType",
        type: "select",
        label: "نوع المعاملة",
        options: transactionTypeOptions.filter((opt) =>
          ["CUSTOMER_REFUND", "CUSTOMER_PAYMENT"].includes(opt.value),
        ),
        col: "half",
      },
      {
        name: "paymentMethod",
        type: "select",
        label: "طريقة الدفع",
        options: paymentMethodOptions.filter((p) =>
          ["ELECTRONIC", "MONETARY"].includes(p.value),
        ),
        col: "half",
        onChange(value) {
          setPaymentMethod(value as PaymentMethod);
        },
      },
      {
        name: "amount",
        type: "number",
        label: "المبلغ",
        placeholder: "مثال: 500",
        col: "half",
      },
      {
        name: "image",
        type: "file",
        label: "صورة اثبات الدفع",
        accept: "image/*",
        disabled: paymentMethod === "MONETARY",
        placeholder: "fs",
        col: "half",
      },
    ],

    defaultValues: {
      subscriptionId: subscriptionId ?? "",
      paymentMethod: "ELECTRONIC",
      transactionType: "CUSTOMER_PAYMENT",
      amount: 50,
    },

    schema: processPaymentTransactionSchema.body,

    submitButton: {
      text: "إضافة المعاملة",
    },

    service: async (body) => {
      if (!academyId) throw Error("معرف الأكاديمية مطلوب");

      if (body.paymentMethod === "ELECTRONIC") {
        if (body.image) {
          const image = await uploadImage(body.image);
          body.image = image;
        } else {
          throw Error("يجب إرسال صورة لإثبات الدفع للدفع الإلكتروني.");
        }
      } else {
        body.image = undefined;
      }

      return createLedgerTransaction({
        params: { academyId },
        body,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyLedgerTransaction });
      queryClient.invalidateQueries({ queryKey: queryKeyClient });
      queryClient.invalidateQueries({ queryKey: queryKeySubscription });
      queryClient.invalidateQueries({ queryKey: queryKeyAcademy });

      toast.success("تم إضافة المعاملة المالية بنجاح");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
