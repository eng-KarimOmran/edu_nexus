import { JobProfileRequestHandler } from './../jobProfile/jobProfile.type';
import { Subscription } from "@/prisma/generated/client";
import { TransactionClient } from "@/prisma/generated/internal/prismaNamespace";
import { SubscriptionGetPayload } from "@/prisma/generated/models";
import { PaginatedResponse } from "../../shared/types/types";
import { CancelSubscriptionDto, CreateSubscriptionDto, DeleteSubscriptionDto, GetAllSubscriptionsDto, GetSubscriptionDetailsDto } from "./subscription.dto";

type SubscriptionDetails = SubscriptionGetPayload<{ include: { walletMovements: true, lessons: true } }> & { paymentSummary: SubscriptionPaymentSummary }

export interface ISubscriptionService {
    createSubscription(data: { data: CreateSubscriptionDto, tx?: TransactionClient, userId?: string }): Promise<Subscription>;

    getAllSubscriptions(
        data: GetAllSubscriptionsDto
    ): Promise<PaginatedResponse<Subscription>>;

    getSubscriptionDetails(data: GetSubscriptionDetailsDto): Promise<SubscriptionDetails>;

    deleteSubscription(data: DeleteSubscriptionDto & { tx?: TransactionClient }): Promise<Subscription>;

    cancelSubscription(data: CancelSubscriptionDto): Promise<Subscription>;

    recalculateSubscriptionStatus(data: { tx: TransactionClient, subscriptionId: string }): Promise<Subscription>;
}

export type GetSubscriptionStatusParams = {
    usedLessons: number;
    totalLessons: number;
    netPaidAmount: number;
    requiredInitialDeposit: number;
    isFullyPaid: boolean;
    isCanceled?: boolean;
    scheduledLessons: number;
    sessionsBeforeFullPayment: number;
};


export interface ISubscriptionController {
    createSubscription: JobProfileRequestHandler;

    getAllSubscriptions: JobProfileRequestHandler;

    getSubscriptionDetails: JobProfileRequestHandler;

    deleteSubscription: JobProfileRequestHandler;

    cancelSubscription: JobProfileRequestHandler;
}

export type SubscriptionPaymentSummary = {
    totalAmountDue: number;
    totalPaidAmount: number;
    refundAmount: number;
    netPaidAmount: number;
    remainingAmount: number;
    isFullyPaid: boolean;
};