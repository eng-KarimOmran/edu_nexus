"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const Pagination_1 = require("../../shared/utils/Pagination");
const lesson_utils_1 = require("../lesson/lesson.utils");
const subscription_utils_1 = require("./subscription.utils");
const walletMovement_service_1 = __importDefault(require("../walletMovement/walletMovement.service"));
const lesson_service_1 = __importDefault(require("../lesson/lesson.service"));
const SubscriptionService = {
    async createSubscription({ data, tx, userId }) {
        const { params, body } = data;
        const { academyId } = params;
        const run = async (tx) => {
            const [client, area, course, walletAcademy, jobProfile] = await Promise.all([
                tx.client.findFirst({ where: { id: body.clientId, academyId }, include: { wallet: true } }),
                tx.area.findFirst({ where: { id: body.areaId } }),
                tx.course.findFirst({ where: { id: body.courseId, academyId } }),
                tx.wallet.findFirst({ where: { academyId, walletType: "ACADEMY" } }),
                ...(userId ? [tx.jobProfile.findFirst({ where: { userId, jobProfileType: "SECRETARY" } })] : [])
            ]);
            if (!client)
                throw ApiError_1.default.NotFound("Client");
            if (!area)
                throw ApiError_1.default.NotFound("Area");
            if (!course)
                throw ApiError_1.default.NotFound("Course");
            if (!client.wallet)
                throw ApiError_1.default.NotFound("wallet");
            if (!walletAcademy)
                throw ApiError_1.default.NotFound("wallet");
            if (!course.isActive)
                throw ApiError_1.default.Inactive("Course");
            const priceAtBooking = course.priceDiscounted ?? course.priceOriginal;
            const dataSubscription = {
                academy: { connect: { id: academyId } },
                client: { connect: { id: client.id } },
                course: { connect: { id: course.id } },
                area: { connect: { id: area.id } },
                ...(jobProfile && { createdBy: { connect: { id: jobProfile.id } } }),
                courseName: course.name,
                priceAtBooking,
                requiredInitialDeposit: course.requiredInitialDeposit,
                sessionDurationMinutes: course.sessionDurationMinutes,
                sessionsBeforeFullPayment: course.sessionsBeforeFullPayment,
                totalSessions: course.totalSessions,
                trainingTypeAtRegistration: body.trainingTypeAtRegistration,
                subscriptionStatus: "PENDING_DEPOSIT",
                walletClientId: client.wallet.id
            };
            const subscription = await tx.subscription.create({ data: dataSubscription });
            const dataWalletMovement = {
                amount: priceAtBooking,
                transactionType: "SUBSCRIPTION_CREATED",
                walletMovementStatus: "APPROVED",
                sender: { connect: { id: client.wallet.id } },
                receiver: { connect: { id: walletAcademy.id } },
                academy: { connect: { id: academyId } },
                subscription: { connect: { id: subscription.id } }
            };
            await Promise.all([
                tx.wallet.update({ where: { id: walletAcademy.id }, data: { balance: { increment: priceAtBooking } } }),
                tx.wallet.update({ where: { id: client.wallet.id }, data: { balance: { decrement: priceAtBooking } } }),
                tx.walletMovement.create({ data: dataWalletMovement })
            ]);
            return subscription;
        };
        return tx ? run(tx) : prisma_1.prisma.$transaction(run);
    },
    async getAllSubscriptions(data) {
        const { params, query } = data;
        const { academyId } = params;
        const { page, limit, search, subscriptionStatus } = query;
        const where = (0, subscription_utils_1.buildSubscriptionWhere)({ search, subscriptionStatus, academyId });
        const { take, skip } = (0, Pagination_1.buildPagination)({ page, limit });
        const [subscriptions, count] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.subscription.findMany({ where, skip, take, orderBy: subscription_utils_1.orderBy }),
            prisma_1.prisma.subscription.count({ where }),
        ]);
        return {
            items: subscriptions,
            pagination: (0, Pagination_1.buildPaginationMeta)({ count, limit, page }),
        };
    },
    async getSubscriptionDetails({ params }) {
        const { subscriptionId } = params;
        const subscription = await prisma_1.prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: {
                lessons: {
                    include: {
                        area: true,
                        client: true,
                        jobProfile: { select: { id: true, user: { select: { id: true, name: true, phone: true } } } },
                        car: true,
                    }
                },
                walletMovements: {
                    include: { paymentProofImage: true }
                },
            }
        });
        if (!subscription)
            throw ApiError_1.default.NotFound("Subscription");
        const paymentSummary = (0, subscription_utils_1.calculateSubscriptionPaymentSummary)(subscription.walletMovements, subscription.priceAtBooking);
        return { ...subscription, paymentSummary };
    },
    async deleteSubscription({ params, tx }) {
        const { subscriptionId, academyId } = params;
        const run = async (tx) => {
            const subscription = await prisma_1.prisma.subscription.findUnique({
                where: { id: subscriptionId, academyId },
                include: { walletMovements: true, lessons: true }
            });
            if (!subscription)
                throw ApiError_1.default.NotFound("Subscription");
            await Promise.all([
                ...subscription.walletMovements.map((w) => walletMovement_service_1.default.deleteWalletMovement({ params: { walletMovementId: w.id, academyId: w.academyId }, tx })),
                ...subscription.lessons.map((l) => lesson_service_1.default.deleteLesson({ params: { academyId: l.academyId, lessonId: l.id }, tx }))
            ]);
            return tx.subscription.delete({
                where: {
                    id: subscriptionId,
                },
            });
        };
        return tx ? await run(tx) : await prisma_1.prisma.$transaction(run);
    },
    async cancelSubscription({ params }) {
        const { subscriptionId } = params;
        return await prisma_1.prisma.$transaction(async (tx) => {
            const subscriptionEx = await prisma_1.prisma.subscription.findUnique({
                where: { id: subscriptionId },
                include: {
                    walletMovements: true
                }
            });
            if (!subscriptionEx)
                throw ApiError_1.default.NotFound("Subscription");
            const { remainingAmount } = (0, subscription_utils_1.calculateSubscriptionPaymentSummary)(subscriptionEx.walletMovements, subscriptionEx.priceAtBooking);
            const subscriptionUpdate = {
                subscriptionStatus: "CANCELED",
                lessons: { deleteMany: { lessonStatus: "SCHEDULED" } }
            };
            const walletAcademy = await tx.wallet.findFirst({ where: { academyId: subscriptionEx.academyId, walletType: "ACADEMY" } });
            if (!walletAcademy)
                throw ApiError_1.default.NotFound("wallet");
            const walletMovement = {
                amount: remainingAmount,
                transactionType: "SUBSCRIPTION_CANCELLED",
                walletMovementStatus: "APPROVED",
                sender: { connect: { id: walletAcademy.id } },
                receiver: { connect: { id: subscriptionEx.walletClientId } },
                academy: { connect: { id: subscriptionEx.academyId } },
                subscription: { connect: { id: subscriptionEx.id } }
            };
            const [subscription] = await Promise.all([
                tx.subscription.update({ where: { id: subscriptionId, }, data: subscriptionUpdate }),
                tx.walletMovement.create({ data: walletMovement }),
                tx.wallet.update({ where: { id: subscriptionEx.walletClientId }, data: { balance: { increment: remainingAmount } } }),
                tx.wallet.update({ where: { id: walletAcademy.id }, data: { balance: { decrement: remainingAmount } } }),
            ]);
            return subscription;
        });
    },
    async recalculateSubscriptionStatus({ subscriptionId, tx }) {
        const subscription = await tx.subscription.findUnique({
            where: { id: subscriptionId }, include: { lessons: true, walletMovements: true }
        });
        if (!subscription)
            throw ApiError_1.default.NotFound("Subscription");
        const { netPaidAmount, isFullyPaid } = (0, subscription_utils_1.calculateSubscriptionPaymentSummary)(subscription.walletMovements, subscription.priceAtBooking);
        const totalLessons = subscription.totalSessions;
        const { SCHEDULED, COMPLETED, CANCELED_CHARGED } = (0, lesson_utils_1.getLessonStats)(subscription.lessons);
        const isCanceled = subscription.subscriptionStatus === "CANCELED";
        const subscriptionStatus = (0, subscription_utils_1.getSubscriptionStatus)({
            netPaidAmount,
            isFullyPaid,
            usedLessons: COMPLETED + CANCELED_CHARGED,
            isCanceled,
            requiredInitialDeposit: subscription.requiredInitialDeposit,
            sessionsBeforeFullPayment: subscription.sessionsBeforeFullPayment,
            totalLessons,
            scheduledLessons: SCHEDULED
        });
        return await tx.subscription.update({ where: { id: subscription.id }, data: { subscriptionStatus } });
    },
};
exports.default = SubscriptionService;
