import * as z from "zod";

import {
  id,
  price,
  paymentMethod,
  transactionType,
  url,
  page,
  limit,
  walletMovementStatus
} from "../../shared/utils/common.validation";

export const GetAllWalletMovement = {
  params: z.object({
    academyId: id,
  }),

  query: z.object({
    page,

    limit,

    search: z.string().optional(),

    transactionType: transactionType.optional(),

    paymentMethod: paymentMethod.optional(),
  }),
};

export const GetWalletMovementDetailsSchema = {
  params: z.object({
    academyId: id,
    walletMovementId: id,
  }),
};

export const ChangeWalletMovementStatusSchema = {
  params: z.object({
    academyId: id,
    walletMovementId: id,
  }),

  body: z.object({
    walletMovementStatus,
  }),
};

export const ProcessPaymentTransactionSchema = {
  params: z.object({
    academyId: id,
  }),
  body: z.object({
    subscriptionId: id,
    transactionType: transactionType.extract(["CUSTOMER_PAYMENT", "CUSTOMER_REFUND"]),
    paymentMethod,
    lessonId: id.optional(),
    amount: price.min(1, "يجب أن يكون مبلغ الدفع أكبر من صفر"),
    image: z.object({
      publicId: z.string().min(1, "معرف الصورة مطلوب"),
      imageUrl: url,
    }).optional(),
  }).refine(
    (data) => {
      const isElectronic = data.paymentMethod === "ELECTRONIC";
      return !isElectronic || !!data.image;
    },
    {
      error: "الصورة مطلوبة عند الدفع الإلكتروني",
      path: ["image"],
      abort: true,
    },
  )
}

export const TransferFundsSchema = {
  params: z.object({
    academyId: id,
  }),
  body: z.object({
    receiverWalletId: id,
    transactionType: transactionType.extract([
      "ACADEMY_TRANSFER_TO_EMPLOYEE",
      "EMPLOYEE_TRANSFER_TO_ACADEMY",
      "EMPLOYEE_TRANSFER_TO_EMPLOYEE"
    ]),
    amount: price.min(1, "يجب أن يكون مبلغ الدفع أكبر من صفر"),
  }),
}