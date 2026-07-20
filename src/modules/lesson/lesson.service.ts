import { LessonCreateInput, LessonUpdateInput } from "@/prisma/generated/models";
import { prisma } from "../../lib/prisma";
import SubscriptionService from "../subscription/subscription.service";
import { ILessonService } from "./lesson.type";
import { buildLessonWhere, calculateLessonTime, getBookingError, getValidatedLessonDependencies, validateTimeSlotConflict, orderBy, validateAreaTransition } from "./lesson.utils";
import { buildPagination, buildPaginationMeta } from "../../shared/utils/Pagination"
import ApiError from "../../shared/utils/ApiError";
import { ProcessPaymentTransactionDto } from "../walletMovement/walletMovement.dto";
import WalletMovementService from "../walletMovement/walletMovement.service";
import { TransactionClient } from "@/prisma/generated/internal/prismaNamespace";

const LessonService: ILessonService = {
  async createLesson({ params, body, userId }) {
    const { academyId } = params;
    const { areaId, startTime, carId, subscriptionId, expectedPaymentAmount, transmission, jobProfileId } = body;

    const lesson = await prisma.$transaction(async (tx) => {
      const { subscription, car, jobProfile } = await getValidatedLessonDependencies({ areaId, carId, jobProfileId, subscriptionId, tx, transmission })

      getBookingError(subscription.subscriptionStatus);

      const timeLesson = calculateLessonTime(startTime, subscription.sessionDurationMinutes)

      await validateTimeSlotConflict({ jobProfileId, carId, startTime: timeLesson.startTime, endTime: timeLesson.endTime, clientId: subscription.clientId, tx });

      await validateAreaTransition({
        tx,
        areaId,
        carId,
        jobProfileId,
        startTime: timeLesson.startTime,
        endTime: timeLesson.endTime,
      });

      const createdBy = await tx.jobProfile.findUnique({ where: { userId } })

      const data: LessonCreateInput = {
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
        ...(createdBy && { createdBy: { connect: { id: createdBy.id } } })
      };

      const lesson = await tx.lesson.create({ data });

      await SubscriptionService.recalculateSubscriptionStatus({ subscriptionId, tx })

      return lesson
    })

    return lesson
  },

  async getAllLessons({ query, params }) {
    const { academyId } = params;
    const { limit, page, lessonStatus, transmission, search, startTime, endTime } = query;

    const where = buildLessonWhere({ search, academyId, lessonStatus, transmission, startTime, endTime });

    const { take, skip } = buildPagination({ page, limit });

    const { lessons, count } = await prisma.$transaction(async (tx) => {
      const [lessons, count] = await Promise.all([
        tx.lesson.findMany({
          where,
          take,
          skip,
          orderBy,
          include: {
            car: true,
            area: true,
            client: true,
            jobProfile: { include: { user: true } },
          }
        }),
        tx.lesson.count({ where })
      ]);
      return { lessons, count }
    })

    const pagination = buildPaginationMeta({ limit, count, page })

    return { items: lessons, pagination }
  },

  async getLessonDetails({ params }) {
    const { lessonId } = params;

    const lesson = await prisma.lesson.findUnique({
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
        },
        createdBy: {
          select: { id: true, user: { select: { id: true, name: true, phone: true } } }
        }
      }
    });

    if (!lesson) throw ApiError.NotFound("Lesson");

    return lesson
  },

  async changeLessonState({ params, body }) {
    const { lessonId } = params;
    const { lessonStatus, amount } = body;

    const updatedLesson = await prisma.$transaction(async (tx) => {

      const lessonEx = await tx.lesson.findUnique({
        where: { id: lessonId },
        include: {
          walletMovement: true
        }
      });

      if (!lessonEx) throw ApiError.NotFound("Lesson");

      const updatedLesson = await tx.lesson.update({
        where: { id: lessonId },
        data: { lessonStatus },
      });



      if (amount && lessonStatus === "COMPLETED") {
        const dataSafe: ProcessPaymentTransactionDto = {
          params: { academyId: updatedLesson.academyId },
          body: {
            amount,
            paymentMethod: "MONETARY",
            transactionType: "CUSTOMER_PAYMENT",
            subscriptionId: updatedLesson.subscriptionId,
            lessonId: updatedLesson.id
          },
        }
        await WalletMovementService.processPaymentTransaction({ ...dataSafe, tx, jobProfileId: lessonEx.jobProfileId })
      }

      await SubscriptionService.recalculateSubscriptionStatus({ tx, subscriptionId: updatedLesson.subscriptionId })

      return updatedLesson
    })

    return updatedLesson
  },

  async updateLesson({ body, params }) {
    const { lessonId } = params;
    const { areaId, carId, expectedPaymentAmount, jobProfileId, startTime, transmission } = body

    const lesson = prisma.$transaction(async (tx) => {
      const lessonEx = await tx.lesson.findUnique({ where: { id: lessonId } });
      if (!lessonEx) throw ApiError.NotFound("Lesson");
      if (lessonEx.lessonStatus !== "SCHEDULED") throw ApiError.Conflict("LESSON_NOT_SCHEDULED")

      const finalData = {
        areaId: areaId ?? lessonEx.areaId,
        carId: carId ?? lessonEx.carId,
        jobProfileId: jobProfileId ?? lessonEx.jobProfileId,
        transmission: transmission ?? lessonEx.transmission,
        subscriptionId: lessonEx.subscriptionId,
      }

      const { subscription, car, jobProfile } = await getValidatedLessonDependencies({ ...finalData, tx })

      const timeLesson = calculateLessonTime(startTime ?? lessonEx.startTime, lessonEx.sessionDurationMinutes)

      await validateTimeSlotConflict({ id: lessonEx.id, jobProfileId: finalData.jobProfileId, carId: finalData.carId, startTime: timeLesson.startTime, endTime: timeLesson.endTime, clientId: subscription.clientId, tx });

      await validateAreaTransition({
        tx,
        areaId: finalData.areaId,
        carId: finalData.carId,
        jobProfileId: finalData.jobProfileId,
        startTime: timeLesson.startTime,
        endTime: timeLesson.endTime,
      });

      const data: LessonUpdateInput = {
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

      return lesson
    })

    return lesson
  },

  async deleteLesson({ params, tx }) {
    const run = async (tx: TransactionClient) => {
      const lessonEx = await tx.lesson.findUnique({ where: { id: params.lessonId }, include: { walletMovement: true } })
      if (!lessonEx) throw ApiError.NotFound("Lesson")
      if (lessonEx.walletMovementId) {
        await WalletMovementService.deleteWalletMovement({ params: { walletMovementId: lessonEx.walletMovementId, academyId: lessonEx.academyId }, tx })
      }
      await tx.lesson.delete({ where: { id: lessonEx.id } })
      await SubscriptionService.recalculateSubscriptionStatus({ subscriptionId: lessonEx.subscriptionId, tx })
      return true
    }

    return tx ? await run(tx) : await prisma.$transaction(run);
  },
};

export default LessonService;