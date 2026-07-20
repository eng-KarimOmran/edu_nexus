"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const subscription_service_1 = __importDefault(require("../subscription/subscription.service"));
const lesson_utils_1 = require("./lesson.utils");
const Pagination_1 = require("../../shared/utils/Pagination");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const walletMovement_service_1 = __importDefault(require("../walletMovement/walletMovement.service"));
const LessonService = {
    async createLesson({ params, body }) {
        const { academyId } = params;
        const { areaId, startTime, carId, subscriptionId, expectedPaymentAmount, transmission, jobProfileId } = body;
        const lesson = await prisma_1.prisma.$transaction(async (tx) => {
            const { subscription, car, jobProfile } = await (0, lesson_utils_1.getValidatedLessonDependencies)({ areaId, carId, jobProfileId, subscriptionId, tx, transmission });
            (0, lesson_utils_1.getBookingError)(subscription.subscriptionStatus);
            const timeLesson = (0, lesson_utils_1.calculateLessonTime)(startTime, subscription.sessionDurationMinutes);
            await (0, lesson_utils_1.validateTimeSlotConflict)({ jobProfileId, carId, startTime: timeLesson.startTime, endTime: timeLesson.endTime, clientId: subscription.clientId, tx });
            await (0, lesson_utils_1.validateAreaTransition)({
                tx,
                areaId,
                carId,
                jobProfileId,
                startTime: timeLesson.startTime,
                endTime: timeLesson.endTime,
            });
            const data = {
                expectedPaymentAmount,
                transmission,
                lessonStatus: "SCHEDULED",
                captainLessonPrice: jobProfile.lessonPrice,
                carSessionPrice: car.carSessionPrice,
                startTime: timeLesson.startTime,
                sessionDurationMinutes: subscription.sessionDurationMinutes,
                endTime: timeLesson.endTime,
                area: { connect: { id: areaId } },
                car: { connect: { id: carId } },
                jobProfile: { connect: { id: jobProfileId } },
                subscription: { connect: { id: subscriptionId } },
                academy: { connect: { id: academyId } },
                client: { connect: { id: subscription.clientId } },
            };
            const lesson = await tx.lesson.create({ data });
            await subscription_service_1.default.recalculateSubscriptionStatus({ subscriptionId, tx });
            return lesson;
        });
        return lesson;
    },
    async getAllLessons({ query, params }) {
        const { academyId } = params;
        const { limit, page, lessonStatus, transmission, search, startTime, endTime } = query;
        const where = (0, lesson_utils_1.buildLessonWhere)({ search, academyId, lessonStatus, transmission, startTime, endTime });
        const { take, skip } = (0, Pagination_1.buildPagination)({ page, limit });
        const { lessons, count } = await prisma_1.prisma.$transaction(async (tx) => {
            const [lessons, count] = await Promise.all([
                tx.lesson.findMany({
                    where,
                    take,
                    skip,
                    orderBy: lesson_utils_1.orderBy,
                    include: {
                        car: true,
                        area: true,
                        client: true,
                        jobProfile: { include: { user: true } },
                    }
                }),
                tx.lesson.count({ where })
            ]);
            return { lessons, count };
        });
        const pagination = (0, Pagination_1.buildPaginationMeta)({ limit, count, page });
        return { items: lessons, pagination };
    },
    async getLessonDetails({ params }) {
        const { lessonId } = params;
        const lesson = await prisma_1.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                walletMovement: true,
                car: true,
                area: true,
                academy: true,
                client: true,
                jobProfile: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });
        if (!lesson)
            throw ApiError_1.default.NotFound("Lesson");
        return lesson;
    },
    async changeLessonState({ params, body }) {
        const { lessonId } = params;
        const { lessonStatus, amount } = body;
        const updatedLesson = await prisma_1.prisma.$transaction(async (tx) => {
            const lessonEx = await tx.lesson.findUnique({
                where: { id: lessonId },
                include: {
                    walletMovement: true
                }
            });
            if (!lessonEx)
                throw ApiError_1.default.NotFound("Lesson");
            const updatedLesson = await tx.lesson.update({
                where: { id: lessonId },
                data: { lessonStatus },
            });
            if (amount && lessonStatus === "COMPLETED") {
                const dataSafe = {
                    params: { academyId: updatedLesson.academyId },
                    body: {
                        amount,
                        paymentMethod: "MONETARY",
                        transactionType: "CUSTOMER_PAYMENT",
                        subscriptionId: updatedLesson.subscriptionId,
                        lessonId: updatedLesson.id
                    },
                };
                await walletMovement_service_1.default.processPaymentTransaction({ ...dataSafe, tx, jobProfileId: lessonEx.jobProfileId });
            }
            await subscription_service_1.default.recalculateSubscriptionStatus({ tx, subscriptionId: updatedLesson.subscriptionId });
            return updatedLesson;
        });
        return updatedLesson;
    },
    async updateLesson({ body, params }) {
        const { lessonId } = params;
        const { areaId, carId, expectedPaymentAmount, jobProfileId, startTime, transmission } = body;
        const lesson = prisma_1.prisma.$transaction(async (tx) => {
            const lessonEx = await tx.lesson.findUnique({ where: { id: lessonId } });
            if (!lessonEx)
                throw ApiError_1.default.NotFound("Lesson");
            if (lessonEx.lessonStatus !== "SCHEDULED")
                throw ApiError_1.default.Conflict("LESSON_NOT_SCHEDULED");
            const finalData = {
                areaId: areaId ?? lessonEx.areaId,
                carId: carId ?? lessonEx.carId,
                jobProfileId: jobProfileId ?? lessonEx.jobProfileId,
                transmission: transmission ?? lessonEx.transmission,
                subscriptionId: lessonEx.subscriptionId,
            };
            const { subscription, car, jobProfile } = await (0, lesson_utils_1.getValidatedLessonDependencies)({ ...finalData, tx });
            const timeLesson = (0, lesson_utils_1.calculateLessonTime)(startTime ?? lessonEx.startTime, lessonEx.sessionDurationMinutes);
            await (0, lesson_utils_1.validateTimeSlotConflict)({ id: lessonEx.id, jobProfileId: finalData.jobProfileId, carId: finalData.carId, startTime: timeLesson.startTime, endTime: timeLesson.endTime, clientId: subscription.clientId, tx });
            await (0, lesson_utils_1.validateAreaTransition)({
                tx,
                areaId: finalData.areaId,
                carId: finalData.carId,
                jobProfileId: finalData.jobProfileId,
                startTime: timeLesson.startTime,
                endTime: timeLesson.endTime,
            });
            const data = {
                expectedPaymentAmount,
                transmission,
                captainLessonPrice: jobProfile.lessonPrice,
                carSessionPrice: car.carSessionPrice,
                startTime: timeLesson.startTime,
                endTime: timeLesson.endTime,
                area: { connect: { id: finalData.areaId } },
                car: { connect: { id: finalData.carId } },
                jobProfile: { connect: { id: finalData.jobProfileId } },
            };
            const lesson = await tx.lesson.update({ where: { id: lessonEx.id }, data });
            return lesson;
        });
        return lesson;
    },
    async deleteLesson({ params, tx }) {
        const run = async (tx) => {
            const lessonEx = await tx.lesson.findUnique({ where: { id: params.lessonId }, include: { walletMovement: true } });
            if (!lessonEx)
                throw ApiError_1.default.NotFound("Lesson");
            if (lessonEx.walletMovementId) {
                await walletMovement_service_1.default.deleteWalletMovement({ params: { walletMovementId: lessonEx.walletMovementId, academyId: lessonEx.academyId }, tx });
            }
            await tx.lesson.delete({ where: { id: lessonEx.id } });
            await subscription_service_1.default.recalculateSubscriptionStatus({ subscriptionId: lessonEx.subscriptionId, tx });
            return true;
        };
        return tx ? await run(tx) : await prisma_1.prisma.$transaction(run);
    },
};
exports.default = LessonService;
