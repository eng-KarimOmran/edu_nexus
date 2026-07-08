import { PayrollCreateInput, PayrollWhereInput } from "@/prisma/generated/models";
import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import { buildPagination, buildPaginationMeta } from "../../shared/utils/Pagination";
import { IPayrollService } from "./payroll.type";

const PayrollService: IPayrollService = {
    async createPayroll({ body }) {
        const {
            jobProfileId,
            academyId,
            baseSalary,
            bonusAmount,
            lessonsAmount,
            subscriptionsAmount,
            deductions
        } = body;

        return prisma.$transaction(async (tx) => {
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
            ])

            if (!jobProfile) {
                throw ApiError.NotFound("JobProfile");
            }

            if (!academy) {
                throw ApiError.NotFound("Academy")
            }

            const totalLessonsCount = jobProfile.lessons.length
            const totalSubscriptionsCount = jobProfile.subscriptions.length
            const totalLessonsAmount = totalLessonsCount * lessonsAmount;
            const totalSubscriptionsAmount = totalSubscriptionsCount * subscriptionsAmount;
            const earningsAmount = totalLessonsAmount + totalSubscriptionsAmount;
            const grossAmount = baseSalary + earningsAmount
            const netAmount = grossAmount + bonusAmount - deductions

            const payrollData: PayrollCreateInput = {
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

        return prisma.$transaction(async (tx) => {
            const payroll = await tx.payroll.findUnique({
                where: {
                    id: payrollId,
                },
            });

            if (!payroll) {
                throw ApiError.NotFound("Payroll");
            }

            const deletePayroll = await tx.payroll.delete({
                where: {
                    id: payrollId,
                },
            })

            return deletePayroll
        });
    },

    async getAllPayroll({ params, query }) {
        const { jobProfileId } = params
        const { limit, page } = query
        const pagination = buildPagination({ page, limit });

        const { payrolls, count } = await prisma.$transaction(async (tx) => {
            const jobProfile = await tx.jobProfile.findUnique({
                where: { id: jobProfileId }
            })

            if (!jobProfile) {
                throw ApiError.NotFound("JobProfile")
            }

            const where: PayrollWhereInput = {
                jobProfileId
            }

            const [payrolls, count] = await Promise.all([
                tx.payroll.findMany({
                    where,
                    include: { academy: true },
                    ...pagination,
                    orderBy: { createdAt: "desc" },
                }),
                tx.payroll.count({ where }),
            ])
            return { payrolls, count }
        })

        const paginationMeta = buildPaginationMeta({ page, limit, count });

        return {
            items: payrolls,
            pagination: paginationMeta,
        }
    },
};

export default PayrollService;