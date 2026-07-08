"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const Pagination_1 = require("../../shared/utils/Pagination");
const PayrollService = {
    async createPayroll({ body }) {
        const { jobProfileId, academyId, baseSalary, bonusAmount, lessonsAmount, subscriptionsAmount, deductions } = body;
        return prisma_1.prisma.$transaction(async (tx) => {
            const [jobProfile, academy] = await Promise.all([
                tx.jobProfile.findFirst({
                    where: {
                        id: jobProfileId,
                    },
                    select: {
                        lessons: {
                            where: {
                                lessonStatus: {
                                    in: ["CANCELED_CHARGED", "COMPLETED"],
                                },
                                payrollId: null,
                            },
                            select: {
                                id: true,
                            },
                            orderBy: {
                                startTime: "asc",
                            },
                        },
                        subscriptions: {
                            where: {
                                academyId,
                                payrollId: null,
                            },
                            select: {
                                id: true,
                            },
                            orderBy: {
                                createdAt: "asc",
                            },
                        },
                    },
                }),
                tx.academy.findUnique({ where: { id: academyId } })
            ]);
            if (!jobProfile) {
                throw ApiError_1.default.NotFound("JobProfile");
            }
            if (!academy) {
                throw ApiError_1.default.NotFound("Academy");
            }
            const totalLessonsCount = jobProfile.lessons.length;
            const totalSubscriptionsCount = jobProfile.subscriptions.length;
            const totalLessonsAmount = totalLessonsCount * lessonsAmount;
            const totalSubscriptionsAmount = totalSubscriptionsCount * subscriptionsAmount;
            const earningsAmount = totalLessonsAmount + totalSubscriptionsAmount;
            const grossAmount = baseSalary + earningsAmount;
            const netAmount = grossAmount + bonusAmount - deductions;
            const payrollData = {
                jobProfile: {
                    connect: {
                        id: jobProfileId,
                    },
                },
                academy: {
                    connect: {
                        id: academyId,
                    },
                },
                baseSalary,
                bonusAmount,
                netAmount,
                totalLessonsCount,
                lessonsAmount,
                totalSubscriptionsCount,
                subscriptionsAmount,
                deductions,
                earningsAmount,
                grossAmount,
            };
            const payroll = await tx.payroll.create({
                data: payrollData,
            });
            const lessonIds = jobProfile.lessons.map((l) => l.id);
            const subscriptionIds = jobProfile.subscriptions.map((s) => s.id);
            await Promise.all([
                tx.lesson.updateMany({
                    where: {
                        id: {
                            in: lessonIds,
                        },
                    },
                    data: {
                        payrollId: payroll.id,
                    },
                }),
                tx.subscription.updateMany({
                    where: {
                        id: {
                            in: subscriptionIds,
                        },
                    },
                    data: {
                        payrollId: payroll.id,
                    },
                }),
            ]);
            return payroll;
        });
    },
    async deletePayroll({ params }) {
        const { payrollId } = params;
        return prisma_1.prisma.$transaction(async (tx) => {
            const payroll = await tx.payroll.findUnique({
                where: {
                    id: payrollId,
                },
            });
            if (!payroll) {
                throw ApiError_1.default.NotFound("Payroll");
            }
            const deletePayroll = await tx.payroll.delete({
                where: {
                    id: payrollId,
                },
            });
            return deletePayroll;
        });
    },
    async getAllPayroll({ params, query }) {
        const { jobProfileId } = params;
        const { limit, page } = query;
        const pagination = (0, Pagination_1.buildPagination)({ page, limit });
        const { payrolls, count } = await prisma_1.prisma.$transaction(async (tx) => {
            const jobProfile = await tx.jobProfile.findUnique({
                where: { id: jobProfileId }
            });
            if (!jobProfile) {
                throw ApiError_1.default.NotFound("JobProfile");
            }
            const where = {
                jobProfileId
            };
            const [payrolls, count] = await Promise.all([
                tx.payroll.findMany({
                    where,
                    include: { academy: true },
                    ...pagination,
                    orderBy: { createdAt: "desc" },
                }),
                tx.payroll.count({ where }),
            ]);
            return { payrolls, count };
        });
        const paginationMeta = (0, Pagination_1.buildPaginationMeta)({ page, limit, count });
        return {
            items: payrolls,
            pagination: paginationMeta,
        };
    },
};
exports.default = PayrollService;
