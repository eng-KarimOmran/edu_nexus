import type { SubscriptionStatus, Transmission } from "@/types/enums";
import type { WalletMovement } from "../ledgerTransaction/ledgerTransaction.type";
import type { Lesson } from "../lesson/lesson.type";
import type { CreatedBy } from "@/types/createdBy";

export type Subscription = {
    id: string;

    subscriptionStatus: SubscriptionStatus

    priceAtBooking: number;
    totalSessions: number;
    sessionDurationMinutes: number;
    requiredInitialDeposit: number;
    sessionsBeforeFullPayment: number;

    trainingTypeAtRegistration: Transmission

    courseName: string;

    clientId: string;
    courseId: string;
    academyId: string;
    areaId: string;

    payrollId: string | null;
    createdById: string | null;

    clientFinancialAccountId: string

    createdAt: string;
};

export type SubscriptionPaymentSummary = {
    totalAmountDue: number;
    totalPaidAmount: number;
    refundAmount: number;
    netPaidAmount: number;
    remainingAmount: number;
    isFullyPaid: boolean;
};

export interface SubscriptionDetails extends Subscription {
    lessons: Lesson[];
    walletMovements: WalletMovement[];
    paymentSummary: SubscriptionPaymentSummary;
    createdBy?: CreatedBy
}