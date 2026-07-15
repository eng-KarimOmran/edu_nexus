import { TransactionClient } from "@/prisma/generated/internal/prismaNamespace";
import { SubscriptionCreateInput, SubscriptionUpdateInput, WalletMovementCreateInput } from "@/prisma/generated/models";
import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import { buildPagination, buildPaginationMeta } from "../../shared/utils/Pagination";
import { getLessonStats } from "../lesson/lesson.utils";
import { ISubscriptionService } from "./subscription.type";
import { buildSubscriptionWhere, calculateSubscriptionPaymentSummary, getSubscriptionStatus, orderBy } from "./subscription.utils";
import WalletMovementService from "../walletMovement/walletMovement.service";
import LessonService from "../lesson/lesson.service";

const SubscriptionService: ISubscriptionService = {
  async createSubscription({ data, tx, userId }) {
    const { params, body } = data;
    const { academyId } = params;

    const run = async (tx: TransactionClient) => {
      const [client, area, course, walletAcademy, jobProfile] = await Promise.all([
        tx.client.findFirst({ where: { id: body.clientId, academyId }, include: { wallet: true } }),
        tx.area.findFirst({ where: { id: body.areaId } }),
        tx.course.findFirst({ where: { id: body.courseId, academyId } }),
        tx.wallet.findFirst({ where: { academyId, walletType: "ACADEMY" } }),
        ...(userId ? [tx.jobProfile.findFirst({ where: { userId, jobProfileType: "SECRETARY" } })] : [])
      ])


      if (!client) throw ApiError.NotFound("Client")
      if (!area) throw ApiError.NotFound("Area")
      if (!course) throw ApiError.NotFound("Course")
      if (!client.wallet) throw ApiError.NotFound("wallet")
      if (!walletAcademy) throw ApiError.NotFound("wallet")
      if (!course.isActive) throw ApiError.Inactive("Course")

      const priceAtBooking = course.priceDiscounted ?? course.priceOriginal

      const dataSubscription: SubscriptionCreateInput = {
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
      }

      const subscription = await tx.subscription.create({ data: dataSubscription })

      const dataWalletMovement: WalletMovementCreateInput = {
        amount: priceAtBooking,
        transactionType: "SUBSCRIPTION_CREATED",
        walletMovementStatus: "APPROVED",
        sender: { connect: { id: client.wallet.id } },
        receiver: { connect: { id: walletAcademy.id } },
        academy: { connect: { id: academyId } },
        subscription: { connect: { id: subscription.id } }
      }

      await Promise.all([
        tx.wallet.update({ where: { id: walletAcademy.id }, data: { balance: { increment: priceAtBooking } } }),
        tx.wallet.update({ where: { id: client.wallet.id }, data: { balance: { decrement: priceAtBooking } } }),
        tx.walletMovement.create({ data: dataWalletMovement })
      ])

      return subscription
    }

    return tx ? run(tx) : prisma.$transaction(run)
  },

  async getAllSubscriptions(data) {
    const { params, query } = data;
    const { academyId } = params;
    const { page, limit, search, subscriptionStatus } = query;

    const where = buildSubscriptionWhere({ search, subscriptionStatus, academyId })

    const { take, skip } = buildPagination({ page, limit })

    const [subscriptions, count] = await prisma.$transaction([
      prisma.subscription.findMany({ where, skip, take, orderBy }),
      prisma.subscription.count({ where }),
    ]);

    return {
      items: subscriptions,
      pagination: buildPaginationMeta({ count, limit, page }),
    };
  },

  async getSubscriptionDetails({ params }) {
    const { subscriptionId } = params;

    const subscription = await prisma.subscription.findUnique({
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
    })

    if (!subscription) throw ApiError.NotFound("Subscription")

    const paymentSummary = calculateSubscriptionPaymentSummary(subscription.walletMovements, subscription.priceAtBooking)

    return { ...subscription, paymentSummary }
  },

  async deleteSubscription({ params, tx }) {
    const { subscriptionId, academyId } = params;

    const run = async (tx: TransactionClient) => {

      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId, academyId },
        include: { walletMovements: true, lessons: true }
      })

      if (!subscription) throw ApiError.NotFound("Subscription")

      await Promise.all(
        [
          ...subscription.walletMovements.map((w) => WalletMovementService.deleteWalletMovement({ params: { walletMovementId: w.id, academyId: w.academyId }, tx })),
          ...subscription.lessons.map((l) => LessonService.deleteLesson({ params: { academyId: l.academyId, lessonId: l.id }, tx }))
        ]
      )

      return tx.subscription.delete({
        where: {
          id: subscriptionId,
        },
      });
    }

    return tx ? await run(tx) : await prisma.$transaction(run);
  },

  async cancelSubscription({ params }) {
    const { subscriptionId } = params;

    return await prisma.$transaction(async (tx) => {
      const subscriptionEx = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: {
          walletMovements: true
        }
      })

      if (!subscriptionEx) throw ApiError.NotFound("Subscription")

      const { remainingAmount } = calculateSubscriptionPaymentSummary(subscriptionEx.walletMovements, subscriptionEx.priceAtBooking)

      const subscriptionUpdate: SubscriptionUpdateInput = {
        subscriptionStatus: "CANCELED",
        lessons: { deleteMany: { lessonStatus: "SCHEDULED" } }
      }

      const walletAcademy = await tx.wallet.findFirst({ where: { academyId: subscriptionEx.academyId, walletType: "ACADEMY" } })
      if (!walletAcademy) throw ApiError.NotFound("wallet")

      const walletMovement: WalletMovementCreateInput = {
        amount: remainingAmount,
        transactionType: "SUBSCRIPTION_CANCELLED",
        walletMovementStatus: "APPROVED",
        sender: { connect: { id: walletAcademy.id } },
        receiver: { connect: { id: subscriptionEx.walletClientId } },
        academy: { connect: { id: subscriptionEx.academyId } },
        subscription: { connect: { id: subscriptionEx.id } }
      }

      const [subscription] = await Promise.all([
        tx.subscription.update({ where: { id: subscriptionId, }, data: subscriptionUpdate }),
        tx.walletMovement.create({ data: walletMovement }),
        tx.wallet.update({ where: { id: subscriptionEx.walletClientId }, data: { balance: { increment: remainingAmount } } }),
        tx.wallet.update({ where: { id: walletAcademy.id }, data: { balance: { decrement: remainingAmount } } }),
      ])

      return subscription
    })
  },

  async recalculateSubscriptionStatus({ subscriptionId, tx }) {
    const subscription = await tx.subscription.findUnique({
      where: { id: subscriptionId }, include: { lessons: true, walletMovements: true }
    })


    if (!subscription) throw ApiError.NotFound("Subscription")

    const { netPaidAmount, isFullyPaid } = calculateSubscriptionPaymentSummary(subscription.walletMovements, subscription.priceAtBooking)

    const totalLessons = subscription.totalSessions

    const { SCHEDULED, COMPLETED, CANCELED_CHARGED } = getLessonStats(subscription.lessons)

    const isCanceled = subscription.subscriptionStatus === "CANCELED"

    const subscriptionStatus = getSubscriptionStatus({
      netPaidAmount,
      isFullyPaid,
      usedLessons: COMPLETED + CANCELED_CHARGED,
      isCanceled,
      requiredInitialDeposit: subscription.requiredInitialDeposit,
      sessionsBeforeFullPayment: subscription.sessionsBeforeFullPayment,
      totalLessons,
      scheduledLessons: SCHEDULED
    })

    return await tx.subscription.update({ where: { id: subscription.id }, data: { subscriptionStatus } })
  },
};

export default SubscriptionService;