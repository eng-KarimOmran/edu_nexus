import {
    id,
    price,
    paymentMethod,
    transactionType,
    page,
    limit,
    walletMovementStatus,
} from "@/lib/common.validation";

import * as z from "zod";

export const processPaymentTransactionSchema = {
    params: z.object({
        academyId: id,
    }),
    body: z.object({
        subscriptionId: id,
        transactionType: transactionType.extract(["CUSTOMER_PAYMENT", "CUSTOMER_REFUND"]),
        paymentMethod: paymentMethod.extract(["ELECTRONIC", "MONETARY"]),
        amount: price.min(1, "يجب أن يكون مبلغ الدفع أكبر من صفر"),
        image: z.any().optional(),
    })
}

export const GetAllLedgerTransactionsSchema = {
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

export const GetLedgerTransactionDetailsSchema = {
    params: z.object({
        academyId: id,
        ledgerTransactionId: id,
    }),
};

export const ChangeLedgerTransactionStatusSchema = {
    params: z.object({
        academyId: id,
        ledgerTransactionId: id,
    }),

    body: z.object({
        walletMovementStatus,
    }),
};

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