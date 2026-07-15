import z from "zod";

import * as Schema from "./ledgerTransaction.schema";

export type ProcessPaymentTransactionSchemaDto = {
    params: z.infer<
        typeof Schema.processPaymentTransactionSchema.params
    >;

    body: z.infer<
        typeof Schema.processPaymentTransactionSchema.body
    >;
};

export type GetAllLedgerTransactionsDto = {
    params: z.infer<
        typeof Schema.GetAllLedgerTransactionsSchema.params
    >;

    query: z.infer<
        typeof Schema.GetAllLedgerTransactionsSchema.query
    >;
};

export type GetLedgerTransactionDetailsDto = {
    params: z.infer<
        typeof Schema.GetLedgerTransactionDetailsSchema.params
    >;
};

export type ChangeLedgerTransactionStatusDto = {
    params: z.infer<
        typeof Schema.ChangeLedgerTransactionStatusSchema.params
    >;

    body: z.infer<
        typeof Schema.ChangeLedgerTransactionStatusSchema.body
    >;
};

export type TransferFundsDto = {
    params: z.infer<
        typeof Schema.TransferFundsSchema.params
    >;

    body: z.infer<
        typeof Schema.TransferFundsSchema.body
    >;
}

export type DeleteLedgerTransactionDto = {
    params: z.infer<
        typeof Schema.DeleteLedgerTransactionSchema.params
    >;
};