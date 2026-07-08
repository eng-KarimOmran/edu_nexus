import z from "zod";
import * as Schema from "./walletMovement.schema";

export type GetAllWalletMovementDto = {
  params: z.infer<typeof Schema.GetAllWalletMovement.params>;
  query: z.infer<typeof Schema.GetAllWalletMovement.query>;
};

export type GetLedgerTransactionDetailsDto = {
  params: z.infer<typeof Schema.GetWalletMovementDetailsSchema.params>;
};

export type ChangeWalletMovementStatusDto = {
  params: z.infer<typeof Schema.ChangeWalletMovementStatusSchema.params>;
  body: z.infer<typeof Schema.ChangeWalletMovementStatusSchema.body>;
};

export type ProcessPaymentTransactionDto = {
  params: z.infer<typeof Schema.ProcessPaymentTransactionSchema.params>;
  body: z.infer<typeof Schema.ProcessPaymentTransactionSchema.body>;
}
export type TransferFundsDto = {
  params: z.infer<typeof Schema.TransferFundsSchema.params>;
  body: z.infer<typeof Schema.TransferFundsSchema.body>;
}