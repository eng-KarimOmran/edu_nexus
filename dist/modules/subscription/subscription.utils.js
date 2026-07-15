"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSubscriptionPaymentSummary = exports.getSubscriptionStatus = exports.orderBy = exports.buildSubscriptionWhere = void 0;
const enums_1 = require("../../prisma/generated/enums");
const buildSubscriptionWhere = ({ search, subscriptionStatus, academyId, }) => {
    const where = { academyId };
    if (search) {
        where.OR = [
            { id: { contains: search } },
            { client: { name: { contains: search, } } },
            { client: { phone: { contains: search } } },
        ];
    }
    if (subscriptionStatus) {
        where.subscriptionStatus = subscriptionStatus;
    }
    return where;
};
exports.buildSubscriptionWhere = buildSubscriptionWhere;
exports.orderBy = {
    createdAt: "desc",
};
const getSubscriptionStatus = (params) => {
    const { usedLessons, totalLessons, netPaidAmount, requiredInitialDeposit, isFullyPaid, isCanceled, scheduledLessons, sessionsBeforeFullPayment, } = params;
    if (isCanceled) {
        return enums_1.SubscriptionStatus.CANCELED;
    }
    if (usedLessons >= totalLessons) {
        return enums_1.SubscriptionStatus.COMPLETED;
    }
    const occupiedLessons = scheduledLessons + usedLessons;
    const isDepositPaid = netPaidAmount >= requiredInitialDeposit;
    const hasScheduledSession = occupiedLessons > 0;
    const reachedPaymentLimit = occupiedLessons >= sessionsBeforeFullPayment;
    if (!isDepositPaid)
        return enums_1.SubscriptionStatus.PENDING_DEPOSIT;
    if (!hasScheduledSession)
        return enums_1.SubscriptionStatus.PENDING_FIRST_SESSION;
    if (!isFullyPaid)
        return reachedPaymentLimit ? enums_1.SubscriptionStatus.SUSPENDED : enums_1.SubscriptionStatus.GRACE_PERIOD;
    if (occupiedLessons >= totalLessons) {
        return enums_1.SubscriptionStatus.FULLY_BOOKED;
    }
    return enums_1.SubscriptionStatus.ACTIVE;
};
exports.getSubscriptionStatus = getSubscriptionStatus;
const calculateSubscriptionPaymentSummary = (walletMovements, totalAmountDue) => {
    let totalPaidAmount = 0, refundAmount = 0;
    for (const transaction of walletMovements) {
        if (transaction.walletMovementStatus !== "APPROVED") {
            continue;
        }
        const amount = Number(transaction.amount);
        if (transaction.transactionType === "CUSTOMER_PAYMENT") {
            totalPaidAmount += amount;
        }
        if (transaction.transactionType === "CUSTOMER_REFUND") {
            refundAmount += amount;
        }
    }
    const netPaidAmount = totalPaidAmount - refundAmount;
    const remainingAmount = totalAmountDue - netPaidAmount;
    const isFullyPaid = remainingAmount <= 0;
    return { totalPaidAmount, refundAmount, netPaidAmount, remainingAmount, totalAmountDue, isFullyPaid };
};
exports.calculateSubscriptionPaymentSummary = calculateSubscriptionPaymentSummary;
