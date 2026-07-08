"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const Pagination_1 = require("../../shared/utils/Pagination");
const jobProfile_utils_1 = require("./jobProfile.utils");
const user_utils_1 = require("../user/user.utils");
const JobProfileService = {
    async createJobProfile({ body }) {
        const { userId, ...jobProfileData } = body;
        const jobProfile = await prisma_1.prisma.jobProfile.findUnique({ where: { userId } });
        if (jobProfile)
            throw ApiError_1.default.Conflict("JOB_PROFILE_EXISTS");
        const data = {
            user: { connect: { id: userId } },
            ...jobProfileData
        };
        return await prisma_1.prisma.jobProfile.create({ data });
    },
    async updateJobProfile({ params, body }) {
        const { jobProfileId } = params;
        const targetJobProfile = await prisma_1.prisma.jobProfile.findUnique({
            where: { id: jobProfileId },
        });
        if (!targetJobProfile)
            throw ApiError_1.default.NotFound("JobProfile");
        const jobProfile = await prisma_1.prisma.jobProfile.update({
            where: { id: jobProfileId },
            data: body,
        });
        return jobProfile;
    },
    async deleteJobProfile({ params }) {
        const { jobProfileId } = params;
        const targetJobProfile = await prisma_1.prisma.jobProfile.findUnique({
            where: { id: jobProfileId },
        });
        if (!targetJobProfile)
            throw ApiError_1.default.NotFound("JobProfile");
        const jobProfile = await prisma_1.prisma.jobProfile.delete({
            where: { id: jobProfileId },
        });
        return jobProfile;
    },
    async getAllJobProfiles({ query }) {
        const { page, limit, ...filters } = query;
        const pagination = (0, Pagination_1.buildPagination)({ page, limit });
        const where = (0, jobProfile_utils_1.buildJobProfileWhere)({ ...filters });
        const { jobProfiles, count } = await prisma_1.prisma.$transaction(async (tx) => {
            const [jobProfiles, count] = await Promise.all([
                tx.jobProfile.findMany({
                    where,
                    orderBy: jobProfile_utils_1.orderBy,
                    include: { user: true },
                    ...pagination,
                }),
                tx.jobProfile.count({ where }),
            ]);
            const jobProfilesSafe = jobProfiles.map((j) => ({ ...j, user: (0, user_utils_1.userSafe)(j.user) }));
            return { jobProfiles: jobProfilesSafe, count };
        });
        const paginationMeta = (0, Pagination_1.buildPaginationMeta)({
            page,
            limit,
            count,
        });
        return {
            items: jobProfiles,
            pagination: paginationMeta,
        };
    },
    async getJobProfileDetails({ params }) {
        const { jobProfileId } = params;
        return await prisma_1.prisma.$transaction(async (tx) => {
            const jobProfile = await tx.jobProfile.findUnique({
                where: { id: jobProfileId },
                include: {
                    user: true,
                    wallets: true,
                },
            });
            if (!jobProfile)
                throw ApiError_1.default.NotFound("JobProfile");
            const [currentLessonCount, currentSubscriptionCount, academies] = await Promise.all([
                tx.lesson.groupBy({
                    by: ["academyId"],
                    where: {
                        jobProfileId,
                        payrollId: null,
                        lessonStatus: { in: ["CANCELED_CHARGED", "COMPLETED"] }
                    },
                    _count: {
                        academyId: true,
                    },
                }),
                tx.subscription.groupBy({
                    by: ["academyId"],
                    where: {
                        createdById: jobProfileId,
                        payrollId: null,
                    },
                    _count: {
                        academyId: true,
                    },
                }),
                tx.academy.findMany({ select: { id: true, name: true } })
            ]);
            const walletBalanceByAcademyId = new Map(jobProfile.wallets.map((wallet) => [wallet.academyId, {
                    id: wallet.id,
                    balance: wallet.balance
                }]));
            const lessonCountByAcademyId = new Map(currentLessonCount.map((lesson) => [
                lesson.academyId,
                lesson._count.academyId,
            ]));
            const subscriptionCountByAcademyId = new Map(currentSubscriptionCount.map((subscription) => [
                subscription.academyId,
                subscription._count.academyId,
            ]));
            const academySummaries = academies.map((academy) => ({
                academyId: academy.id,
                academyName: academy.name,
                wallet: walletBalanceByAcademyId.get(academy.id) ?? null,
                lessonCount: lessonCountByAcademyId.get(academy.id) ?? 0,
                subscriptionCount: subscriptionCountByAcademyId.get(academy.id) ?? 0,
            }));
            const { wallets, user, ...jobProfileData } = jobProfile;
            return {
                ...jobProfileData,
                user: (0, user_utils_1.userSafe)(user),
                academySummaries,
            };
        });
    },
};
exports.default = JobProfileService;
