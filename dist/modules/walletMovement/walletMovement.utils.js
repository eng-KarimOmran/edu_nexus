"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBy = exports.getAndValidateSubscription = exports.getOrCreateInternalWallet = exports.buildWalletMovementWhere = void 0;
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const subscription_utils_1 = require("../subscription/subscription.utils");
const buildWalletMovementWhere = ({ academyId, search, paymentMethod, transactionType, }) => {
    const where = {
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
exports.buildWalletMovementWhere = buildWalletMovementWhere;
const getOrCreateInternalWallet = async ({ academyId, isOwner, paymentMethod, jobProfileId, tx }) => {
    const isAcademy = isOwner || paymentMethod === "ELECTRONIC";
    if (isAcademy) {
        const wallet = await tx.wallet.findFirst({
            where: { academyId, walletType: "ACADEMY" }
        });
        if (!wallet) {
            throw ApiError_1.default.NotFound("wallet");
        }
        return wallet;
    }
    if (!jobProfileId)
        throw ApiError_1.default.BadRequest("jobProfileId is required when the operation is not performed by the academy owner");
    const walletEx = await tx.wallet.findUnique({
        where: { jobProfileId_academyId: { academyId, jobProfileId } }
    });
    if (walletEx)
        return walletEx;
    return await tx.wallet.create({
        data: { academyId, jobProfileId, walletType: "JOB_PROFILE" }
    });
};
exports.getOrCreateInternalWallet = getOrCreateInternalWallet;
const getAndValidateSubscription = async ({ subscriptionId, transactionType, amount, tx }) => {
    const subscription = await tx.subscription.findUnique({
        where: { id: subscriptionId },
        include: {
            client: true,
            walletMovements: true,
        }
    });
    if (!subscription)
        throw ApiError_1.default.NotFound("Subscription");
    const { isFullyPaid, netPaidAmount, remainingAmount } = (0, subscription_utils_1.calculateSubscriptionPaymentSummary)(subscription.walletMovements, subscription.priceAtBooking);
    switch (transactionType) {
        case "CUSTOMER_REFUND":
            if (amount > netPaidAmount)
                throw ApiError_1.default.Conflict("EXCESS_REFUND");
            break;
        case "CUSTOMER_PAYMENT":
            if (isFullyPaid)
                throw ApiError_1.default.Conflict("SUBSCRIPTION_ALREADY_PAID");
            if (amount > remainingAmount)
                throw ApiError_1.default.Conflict("OVERPAYMENT");
            break;
    }
    return subscription;
};
exports.getAndValidateSubscription = getAndValidateSubscription;
exports.orderBy = {
    createdAt: "desc",
};
