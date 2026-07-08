import { ClientWhereInput } from '@/prisma/generated/models/Client';
import {
    LessonWhereInput,
    SubscriptionWhereInput,
    TransactionClient,
    WalletMovementWhereInput
} from "@/prisma/generated/internal/prismaNamespace";
import { prisma } from '../../lib/prisma';
import { IDashboardService } from './statistics.type';
import { SubscriptionStatus } from '@/prisma/generated/enums';

const DashboardService: IDashboardService = {
    clients: async ({ dataSafe, tx }) => {
        const { academyId } = dataSafe.params;
        const { startDate, endDate } = dataSafe.query;
        const dateRange = { gte: startDate, lte: endDate };
        const baseWhere: ClientWhereInput = { academyId, createdAt: dateRange };

        const run = async (tx: TransactionClient) => {
            const stats = await tx.client.groupBy({
                by: ["source"],
                where: baseWhere,
                _count: { id: true },
            });

            const officeCount = stats.find(s => s.source === "OFFICE")?._count.id ?? 0;
            const platformCount = stats.find(s => s.source === "PLATFORM")?._count.id ?? 0;

            return {
                officeCount,
                platformCount,
                totalClient: officeCount + platformCount,
            };
        };

        return tx ? run(tx) : prisma.$transaction(run);
    },


    courses: async ({ dataSafe, tx }) => {
        const { academyId } = dataSafe.params;
        const { startDate, endDate } = dataSafe.query;
        const dateRange = { gte: startDate, lte: endDate };
        const baseWhere: SubscriptionWhereInput = { academyId, createdAt: dateRange };

        const run = async (tx: TransactionClient) => {
            const courseStats = await tx.subscription.groupBy({
                by: ["courseId"],
                where: baseWhere,
                _count: { id: true },
            });

            if (courseStats.length === 0) return [];

            const courseIds = courseStats.map(c => c.courseId);

            const courses = await tx.course.findMany({
                where: { id: { in: courseIds } },
                select: { id: true, name: true },
            });

            const courseMap = new Map(courses.map(c => [c.id, c.name]));

            return courseStats.map(c => ({
                courseId: c.courseId,
                name: courseMap.get(c.courseId) ?? "Unknown",
                count: c._count.id,
            }));
        };

        return tx ? run(tx) : prisma.$transaction(run);
    },

    subscriptions: async ({ dataSafe, tx }) => {
        const { academyId } = dataSafe.params;
        const { startDate, endDate } = dataSafe.query;
        const dateRange = { gte: startDate, lte: endDate };
        const baseWhere: SubscriptionWhereInput = { academyId, createdAt: dateRange };

        const run = async (tx: TransactionClient) => {
            const stats = await tx.subscription.groupBy({
                by: ["subscriptionStatus"],
                where: baseWhere,
                _count: { id: true },
            });

            const SUBSCRIPTION_STATUSES = Object.values(SubscriptionStatus);

            const result = Object.fromEntries(
                SUBSCRIPTION_STATUSES.map(status => [
                    status,
                    stats.find(s => s.subscriptionStatus === status)?._count.id ?? 0
                ])
            ) as Record<SubscriptionStatus, number>;

            const total = SUBSCRIPTION_STATUSES.reduce((sum, status) => sum + (result[status] ?? 0), 0);

            return { ...result, totalSubscription: total };
        };

        return tx ? run(tx) : prisma.$transaction(run);
    },

    // ─── Ledger Transactions ─────────────────────────────────────────────────────
    ledgerTransaction: async ({ dataSafe, tx }) => {
        const { academyId } = dataSafe.params;
        const { startDate, endDate } = dataSafe.query;
        const dateRange = { gte: startDate, lte: endDate };
        const baseWhere: WalletMovementWhereInput = { academyId, createdAt: dateRange };

        const run = async (tx: TransactionClient) => {
            const stats = await tx.walletMovement.groupBy({
                by: ["transactionType", "paymentMethod"],
                where: {
                    ...baseWhere,
                    transactionType: { in: ["CUSTOMER_PAYMENT", "CUSTOMER_REFUND"] },
                },
                _sum: { amount: true },
            });

            const find = (type: string, method?: string) =>
                Number(
                    stats.find(
                        s => s.transactionType === type &&
                            (method === undefined || s.paymentMethod === method)
                    )?._sum.amount ?? 0
                );

            const cash = find("CUSTOMER_PAYMENT", "MONETARY");
            const wallet = find("CUSTOMER_PAYMENT", "ELECTRONIC");
            const refund = find("CUSTOMER_REFUND");

            return {
                totalCash: cash,
                totalWallet: wallet,
                totalRefund: refund,
                totalCollected: cash + wallet - refund,
            };
        };

        return tx ? run(tx) : prisma.$transaction(run);
    },

    lessons: async ({ dataSafe, tx }) => {
        const { academyId } = dataSafe.params;
        const { startDate, endDate } = dataSafe.query;
        const dateRange = { gte: startDate, lte: endDate };
        const baseWhere: LessonWhereInput = { academyId, endTime: dateRange };

        const run = async (tx: TransactionClient) => {
            const [statusStats, transmissionStats] = await Promise.all([
                tx.lesson.groupBy({
                    by: ["lessonStatus"],
                    where: baseWhere,
                    _count: { id: true },
                }),
                tx.lesson.groupBy({
                    by: ["transmission"],
                    where: baseWhere,
                    _count: { id: true },
                }),
            ]);

            const getStatus = (s: string) => statusStats.find(x => x.lessonStatus === s)?._count.id ?? 0;
            const getTransmission = (t: string) => transmissionStats.find(x => x.transmission === t)?._count.id ?? 0;

            const lessonAutomatic = getTransmission("AUTOMATIC");
            const lessonManual = getTransmission("MANUAL");

            return {
                lessonCanceled: getStatus("CANCELED"),
                lessonCanceledCharged: getStatus("CANCELED_CHARGED"),
                lessonCompleted: getStatus("COMPLETED"),
                lessonScheduled: getStatus("SCHEDULED"),
                lessonAutomatic,
                lessonManual,
                totalLesson: lessonAutomatic + lessonManual,
            };
        };

        return tx ? run(tx) : prisma.$transaction(run);
    },

    area: async ({ dataSafe, tx }) => {
        const { academyId } = dataSafe.params;
        const { startDate, endDate } = dataSafe.query;
        const dateRange = { gte: startDate, lte: endDate };
        const baseWhere: LessonWhereInput = { academyId, endTime: dateRange };

        const run = async (tx: TransactionClient) => {
            const areaStats = await tx.lesson.groupBy({
                by: ["areaId"],
                where: baseWhere,
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
            });

            if (areaStats.length === 0) return [];

            const areaIds = areaStats.map(a => a.areaId).filter(Boolean) as string[];

            const areas = await tx.area.findMany({
                where: { id: { in: areaIds } },
                select: { id: true, name: true },
            });

            const areaMap = new Map(areas.map(a => [a.id, a.name]));

            return areaStats
                .filter(a => a.areaId)
                .map(a => ({
                    areaId: a.areaId!,
                    name: areaMap.get(a.areaId!) ?? "Unknown",
                    countLesson: a._count.id,
                }));
        };

        return tx ? run(tx) : prisma.$transaction(run);
    },

    car: async ({ dataSafe, tx }) => {
        const { academyId } = dataSafe.params;
        const { startDate, endDate } = dataSafe.query;
        const dateRange = { gte: startDate, lte: endDate };
        const baseWhere: LessonWhereInput = { academyId, endTime: dateRange };

        const run = async (tx: TransactionClient) => {
            const carStats = await tx.lesson.groupBy({
                by: ["carId"],
                where: baseWhere,
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
            });

            if (carStats.length === 0) return [];

            const carIds = carStats.map(c => c.carId).filter(Boolean) as string[];

            const cars = await tx.car.findMany({
                where: { id: { in: carIds } },
                select: { id: true, modelName: true, plateNumber: true },
            });

            const carMap = new Map(cars.map(c => [c.id, c]));

            return carStats
                .filter(c => c.carId)
                .map(c => ({
                    carId: c.carId!,
                    modelName: carMap.get(c.carId!)?.modelName ?? "Unknown",
                    plateNumber: carMap.get(c.carId!)?.plateNumber ?? "Unknown",
                    countLesson: c._count.id,
                }));
        };

        return tx ? run(tx) : prisma.$transaction(run);
    },

    captain: async ({ dataSafe, tx }) => {
        const { academyId } = dataSafe.params;
        const { startDate, endDate } = dataSafe.query;
        const dateRange = { gte: startDate, lte: endDate };
        const baseWhere: LessonWhereInput = { academyId, endTime: dateRange, lessonStatus: "COMPLETED" };

        const run = async (tx: TransactionClient) => {
            const captainStats = await tx.lesson.groupBy({
                by: ["jobProfileId"],
                where: baseWhere,
                _count: { id: true },
            });

            const ids = captainStats.map(c => c.jobProfileId).filter(Boolean) as string[];
            if (ids.length === 0) return [];

            const captains = await tx.jobProfile.findMany({
                where: { id: { in: ids } },
                select: {
                    id: true,
                    user: { select: { id: true, name: true, phone: true } },
                },
            });

            const captainMap = new Map(captains.map(c => [c.id, c]));

            return captainStats
                .filter(c => c.jobProfileId)
                .map(c => {
                    const profile = captainMap.get(c.jobProfileId!);
                    return {
                        captainId: c.jobProfileId!,
                        userId: profile?.user.id ?? "",
                        name: profile?.user.name ?? "Unknown",
                        phone: profile?.user.phone ?? "",
                        countLesson: c._count.id,
                    };
                });
        };

        return tx ? run(tx) : prisma.$transaction(run);
    },

    usersCreatedSubscription: async ({ dataSafe, tx }) => {
        const { academyId } = dataSafe.params;
        const { startDate, endDate } = dataSafe.query;
        const dateRange = { gte: startDate, lte: endDate };
        const baseWhere: SubscriptionWhereInput = { academyId, createdAt: dateRange };

        const run = async (tx: TransactionClient) => {
            const jobProfileStats = await tx.subscription.groupBy({
                by: ["createdById"],
                where: {
                    ...baseWhere,
                    subscriptionStatus: { not: "PENDING_DEPOSIT" },
                },
                _count: { id: true },
            });

            const ids = jobProfileStats.map(j => j.createdById).filter(Boolean) as string[];
            if (ids.length === 0) return [];

            const jobProfiles = await tx.jobProfile.findMany({
                where: { id: { in: ids } },
                select: {
                    id: true,
                    user: { select: { id: true, name: true, phone: true } },
                },
            });

            const profileMap = new Map(jobProfiles.map(j => [j.id, j]));

            return jobProfileStats
                .filter(j => j.createdById)
                .map(j => {
                    const profile = profileMap.get(j.createdById!);
                    return {
                        jobProfilesId: j.createdById!,
                        name: profile?.user.name ?? "Unknown",
                        phone: profile?.user.phone ?? "",
                        countSubscription: j._count.id,
                    };
                });
        };

        return tx ? run(tx) : prisma.$transaction(run);
    },
};

export default DashboardService;