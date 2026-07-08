
import { Subscription, Wallet } from "@/prisma/generated/client";
import {
  PaymentMethod,
  TransactionType,
} from "@/prisma/generated/enums";
import { TransactionClient } from "@/prisma/generated/internal/prismaNamespace";
import { WalletMovementOrderByWithRelationInput, WalletMovementWhereInput } from "@/prisma/generated/models";
import ApiError from "../../shared/utils/ApiError";
import { calculateSubscriptionPaymentSummary } from "../subscription/subscription.utils";

export const buildWalletMovementWhere = ({
  academyId,
  search,
  paymentMethod,
  transactionType,
}: {
  academyId: string;
  search?: string;
  paymentMethod?: PaymentMethod;
  transactionType?: TransactionType;
}): WalletMovementWhereInput => {
  const where: WalletMovementWhereInput = {
    academyId,
  };

  if (transactionType) {
    where.transactionType = transactionType;
  }

  if (paymentMethod) {
    where.paymentMethod = paymentMethod;
  }

  if (search) {
    where.OR = [
      {
        subscription: { id: { contains: search } },
      },
    ];
  }

  return where;
};

export const getOrCreateInternalWallet = async ({ academyId, isOwner, paymentMethod, jobProfileId, tx }: { academyId: string, isOwner?: boolean, paymentMethod: PaymentMethod, tx: TransactionClient, jobProfileId?: string }): Promise<Wallet> => {
  const isAcademy = isOwner || paymentMethod === "ELECTRONIC";

  if (isAcademy) {
    const wallet = await tx.wallet.findFirst({
      where: { academyId, walletType: "ACADEMY" }
    });
    if (!wallet) {
      throw ApiError.NotFound("wallet")
    }

    return wallet
  }

  if (!jobProfileId) throw ApiError.BadRequest("jobProfileId is required when the operation is not performed by the academy owner");

  const walletEx = await tx.wallet.findUnique({
    where: { jobProfileId_academyId: { academyId, jobProfileId } }
  });

  if (walletEx) return walletEx;

  return await tx.wallet.create({
    data: { academyId, jobProfileId, walletType: "JOB_PROFILE" }
  });
}

export const getAndValidateSubscription = async ({ subscriptionId, transactionType, amount, tx }: { subscriptionId: string, transactionType: TransactionType, amount: number, tx: TransactionClient }): Promise<Subscription> => {
  const subscription = await tx.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      client: true,
      walletMovements: true,
    }
  });

  if (!subscription) throw ApiError.NotFound("Subscription");

  const { isFullyPaid, netPaidAmount, remainingAmount } = calculateSubscriptionPaymentSummary(
    subscription.walletMovements,
    subscription.priceAtBooking
  );

  switch (transactionType) {
    case "CUSTOMER_REFUND":
      if (amount > netPaidAmount) throw ApiError.Conflict("EXCESS_REFUND");
      break;
    case "CUSTOMER_PAYMENT":
      if (isFullyPaid) throw ApiError.Conflict("SUBSCRIPTION_ALREADY_PAID");
      if (amount > remainingAmount) throw ApiError.Conflict("OVERPAYMENT");
      break;
  }

  return subscription;
}

export const orderBy: WalletMovementOrderByWithRelationInput = {
  createdAt: "desc",
}