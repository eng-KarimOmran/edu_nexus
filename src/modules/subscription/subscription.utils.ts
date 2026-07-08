import { WalletMovement } from "@/prisma/generated/client";
import { SubscriptionStatus } from "@/prisma/generated/enums";
import {
  SubscriptionOrderByWithRelationInput,
  SubscriptionWhereInput,
} from "@/prisma/generated/models";
import { GetSubscriptionStatusParams, SubscriptionPaymentSummary } from "./subscription.type";

export const buildSubscriptionWhere = ({
  search,
  subscriptionStatus,
  academyId,
}: {
  search?: string;
  academyId: string;
  subscriptionStatus?: SubscriptionStatus;
}): SubscriptionWhereInput => {
  const where: SubscriptionWhereInput = { academyId };

  if (search) {
    where.OR = [
      { id: { contains: search } },
      { client: { name: { contains: search,  } } },
      { client: { phone: { contains: search } } },
    ];
  }

  if (subscriptionStatus) {
    where.subscriptionStatus = subscriptionStatus;
  }

  return where;
};

export const orderBy: SubscriptionOrderByWithRelationInput = {
  createdAt: "desc",
};

export const getSubscriptionStatus = (params: GetSubscriptionStatusParams): SubscriptionStatus => {
  const {
    usedLessons,
    totalLessons,
    netPaidAmount,
    requiredInitialDeposit,
    isFullyPaid,
    isCanceled,
    scheduledLessons,
    sessionsBeforeFullPayment,
  } = params

  if (isCanceled) {
    return SubscriptionStatus.CANCELED;
  }

  if (usedLessons >= totalLessons) {
    return SubscriptionStatus.COMPLETED;
  }

  const isDepositPaid = netPaidAmount >= requiredInitialDeposit;
  const hasScheduledSession = scheduledLessons > 0;
  const reachedPaymentLimit = usedLessons + scheduledLessons >= sessionsBeforeFullPayment;

  if (!isDepositPaid) return SubscriptionStatus.PENDING_DEPOSIT

  if (!hasScheduledSession) return SubscriptionStatus.PENDING_FIRST_SESSION;

  if (!isFullyPaid) return reachedPaymentLimit ? SubscriptionStatus.SUSPENDED : SubscriptionStatus.GRACE_PERIOD;

  return SubscriptionStatus.ACTIVE;
};

export const calculateSubscriptionPaymentSummary = (walletMovements: WalletMovement[], totalAmountDue: number): SubscriptionPaymentSummary => {
  let totalPaidAmount = 0, refundAmount = 0;

  for (const transaction of walletMovements) {
    if (transaction.walletMovementStatus !== "APPROVED") { continue; }
    const amount = Number(transaction.amount)

    if (transaction.transactionType === "CUSTOMER_PAYMENT") {
      totalPaidAmount += amount;
    }

    if (transaction.transactionType === "CUSTOMER_REFUND") {
      refundAmount += amount;
    }
  }
  
  const netPaidAmount = totalPaidAmount - refundAmount

  const remainingAmount = totalAmountDue - netPaidAmount

  const isFullyPaid = remainingAmount <= 0;

  return { totalPaidAmount, refundAmount, netPaidAmount, remainingAmount, totalAmountDue, isFullyPaid }
}