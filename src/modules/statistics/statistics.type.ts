import { TransactionClient } from "@/prisma/generated/internal/prismaNamespace";
import * as DTO from "./statistics.dto";

export interface IDashboardService {
    clients: (data: { dataSafe: DTO.GetDashboardAnalyticsDto; tx?: TransactionClient }) => Promise<{
        officeCount: number;
        platformCount: number;
        totalClient: number;
    }>;

    courses: (data: { dataSafe: DTO.GetDashboardAnalyticsDto; tx?: TransactionClient }) => Promise<{
        courseId: string;
        name: string;
        count: number;
    }[]>;

    subscriptions: (data: { dataSafe: DTO.GetDashboardAnalyticsDto; tx?: TransactionClient }) => Promise<{
        PENDING_DEPOSIT: number;
        PENDING_FIRST_SESSION: number;
        GRACE_PERIOD: number;
        SUSPENDED: number;
        ACTIVE: number;
        CANCELED: number;
        COMPLETED: number;
        totalSubscription: number;
    }>;

    ledgerTransaction: (data: { dataSafe: DTO.GetDashboardAnalyticsDto; tx?: TransactionClient }) => Promise<{
        totalCash: number;
        totalRefund: number;
        totalCollected: number;
        totalWallet: number
    }>;

    lessons: (data: { dataSafe: DTO.GetDashboardAnalyticsDto; tx?: TransactionClient }) => Promise<{
        lessonCanceled: number;
        lessonCanceledCharged: number;
        lessonCompleted: number;
        lessonScheduled: number;
        lessonAutomatic: number;
        lessonManual: number;
        totalLesson: number;
    }>;

    area: (data: { dataSafe: DTO.GetDashboardAnalyticsDto; tx?: TransactionClient }) => Promise<{
        areaId: string;
        name: string;
        countLesson: number;
    }[]>;

    car: (data: { dataSafe: DTO.GetDashboardAnalyticsDto; tx?: TransactionClient }) => Promise<{
        carId: string;
        modelName: string;
        plateNumber: string;
        countLesson: number;
    }[]>;

    captain: (data: { dataSafe: DTO.GetDashboardAnalyticsDto; tx?: TransactionClient }) => Promise<{
        captainId: string;
        userId: string;
        name: string;
        phone: string;
        countLesson: number;
    }[]>;

    usersCreatedSubscription: (data: { dataSafe: DTO.GetDashboardAnalyticsDto; tx?: TransactionClient }) => Promise<{
        jobProfilesId: string;
        name: string;
        phone: string;
        countSubscription: number;
    }[]>;
}
