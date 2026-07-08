import { IJobProfileService } from "./jobProfile.type";
import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import { buildPagination, buildPaginationMeta } from "../../shared/utils/Pagination";
import { buildJobProfileWhere, orderBy } from "./jobProfile.utils";
import { JobProfileCreateInput } from "@/prisma/generated/models";
import { userSafe } from "../user/user.utils";

const JobProfileService: IJobProfileService = {
  async createJobProfile({ body }) {
    const { userId, ...jobProfileData } = body

    const jobProfile = await prisma.jobProfile.findUnique({ where: { userId } })

    if (jobProfile) throw ApiError.Conflict("JOB_PROFILE_EXISTS")

    const data: JobProfileCreateInput = {
      user: { connect: { id: userId } },
      ...jobProfileData
    }

    return await prisma.jobProfile.create({ data });
  },

  async updateJobProfile({ params, body }) {
    const { jobProfileId } = params;

    const targetJobProfile = await prisma.jobProfile.findUnique({
      where: { id: jobProfileId },
    });

    if (!targetJobProfile) throw ApiError.NotFound("JobProfile");

    const jobProfile = await prisma.jobProfile.update({
      where: { id: jobProfileId },
      data: body,
    });

    return jobProfile;
  },

  async deleteJobProfile({ params }) {
    const { jobProfileId } = params;

    const targetJobProfile = await prisma.jobProfile.findUnique({
      where: { id: jobProfileId },
    });

    if (!targetJobProfile) throw ApiError.NotFound("JobProfile");

    const jobProfile = await prisma.jobProfile.delete({
      where: { id: jobProfileId },
    });

    return jobProfile;
  },

  async getAllJobProfiles({ query }) {
    const { page, limit, ...filters } = query;

    const pagination = buildPagination({ page, limit });

    const where = buildJobProfileWhere({ ...filters });

    const { jobProfiles, count } = await prisma.$transaction(async (tx) => {
      const [jobProfiles, count] = await Promise.all([
        tx.jobProfile.findMany({
          where,
          orderBy,
          include: { user: true },
          ...pagination,
        }),
        tx.jobProfile.count({ where }),
      ]);

      const jobProfilesSafe = jobProfiles.map((j) => ({ ...j, user: userSafe(j.user) }));

      return { jobProfiles: jobProfilesSafe, count };
    });

    const paginationMeta = buildPaginationMeta({
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

    return await prisma.$transaction(async (tx) => {
      const jobProfile = await tx.jobProfile.findUnique({
        where: { id: jobProfileId },
        include: {
          user: true,
          wallets: true,
        },
      });

      if (!jobProfile) throw ApiError.NotFound("JobProfile");

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

      const walletBalanceByAcademyId = new Map(
        jobProfile.wallets.map((wallet) => [wallet.academyId, {
          id: wallet.id,
          balance: wallet.balance
        }]),
      );

      const lessonCountByAcademyId = new Map(
        currentLessonCount.map((lesson) => [
          lesson.academyId,
          lesson._count.academyId,
        ]),
      );

      const subscriptionCountByAcademyId = new Map(
        currentSubscriptionCount.map((subscription) => [
          subscription.academyId,
          subscription._count.academyId,
        ]),
      );

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
        user: userSafe(user),
        academySummaries,
      };
    })
  },
};

export default JobProfileService;