import { LessonOrderByWithRelationInput } from '@/prisma/generated/models/Lesson';
import dayjs from "dayjs";
import { LessonStatus, SubscriptionStatus, Transmission } from "@/prisma/generated/enums";
import { LessonWhereInput } from "@/prisma/generated/models";
import ApiError from "../../shared/utils/ApiError";
import { Lesson } from "@/prisma/generated/client";
import { TransactionClient } from "@/prisma/generated/internal/prismaNamespace";

export const calculateLessonTime = (
  startTime: Date | string,
  durationMinutes: number,
) => {
  const start = dayjs(startTime);

  const end = start.add(durationMinutes, "minute");

  return {
    startTime: start.toDate(),
    endTime: end.toDate(),
  };
};

export const buildLessonWhere = ({
  search,
  academyId,
  lessonStatus,
  transmission,
  startTime,
  endTime
}: {
  search?: string;
  lessonStatus?: LessonStatus;
  academyId: string;
  transmission?: Transmission;
  startTime?: string | Date;
  endTime?: string | Date;
}): LessonWhereInput => {
  const where: LessonWhereInput = { academyId };

  if (search) {
    where.OR = [
      { id: { contains: search } },
    ];
  }

  if (lessonStatus) {
    where.lessonStatus = lessonStatus;
  }

  if (transmission) {
    where.transmission = transmission;
  }

  if (startTime) {
    where.startTime = { gte: new Date(startTime) };
  }

  if (endTime) {
    where.endTime = { lte: new Date(endTime) };
  }

  return where;
};

export const getBookingError = (status: SubscriptionStatus): void => {
  switch (status) {
    case "PENDING_DEPOSIT":
      throw ApiError.BadRequest("لا يمكن جدولة حصة جديدة لأن الاشتراك لم يتم تفعيله بعد. يرجى سداد مبلغ العربون (الديبوزت) أولاً.");
    case "CANCELED":
      throw ApiError.BadRequest("لا يمكن جدولة حصة جديدة؛ هذا الاشتراك تم إلغاؤه مسبقاً.");
    case "COMPLETED":
      throw ApiError.BadRequest("لا يمكن جدولة حصة جديدة؛ لقد اكتملت جميع الحصص الخاصة بهذا الاشتراك.");
    case 'SUSPENDED':
      throw ApiError.BadRequest("لا يمكن جدولة حصة جديدة لأنه تم استهلاك جميع الحصص المسموح بها قبل السداد الكامل. يرجى استكمال سداد قيمة الاشتراك لإعادة تفعيل الاشتراك.");
  }
};

export const validateTimeSlotConflict = async ({
  id,
  tx,
  startTime,
  endTime,
  carId,
  jobProfileId,
  clientId,
}: {
  clientId: string;
  carId: string;
  jobProfileId: string;
  startTime: Date;
  endTime: Date;
  id?: string;
  tx: TransactionClient
}) => {
  const conflictingLesson = await tx.lesson.findFirst({
    where: {
      lessonStatus: "SCHEDULED",
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      OR: [
        { jobProfileId },
        { carId },
        { clientId }
      ],
      ...(id && { id: { not: id } }),
    },
  });

  if (conflictingLesson) {
    if (conflictingLesson.jobProfileId === jobProfileId) throw ApiError.Conflict("CAPTAIN_TIME_CONFLICT");
    if (conflictingLesson.carId === carId) throw ApiError.Conflict("CAR_TIME_CONFLICT");
    if (conflictingLesson.clientId === clientId) throw ApiError.Conflict("CLIENT_TIME_CONFLICT");
  }
};

export const getValidatedLessonDependencies = async ({
  tx,
  subscriptionId,
  carId,
  areaId,
  jobProfileId,
  transmission
}: {
  tx: TransactionClient;
  subscriptionId: string;
  carId: string;
  areaId: string;
  jobProfileId: string;
  transmission: Transmission;
}) => {
  const [subscription, car, area, jobProfile] = await Promise.all([
    tx.subscription.findUnique({
      where: { id: subscriptionId },
    }),
    tx.car.findUnique({
      where: { id: carId },
    }),
    tx.area.findUnique({
      where: { id: areaId },
    }),
    tx.jobProfile.findUnique({
      where: { id: jobProfileId, supportType: { in: ["BOTH", transmission] } },
    }),
  ]);

  if (!subscription) throw ApiError.NotFound("Subscription");
  if (!jobProfile) throw ApiError.NotFound("Captain");
  if (!car) throw ApiError.NotFound("Car");
  if (!area) throw ApiError.NotFound("Area");

  if (!car.isActive) throw ApiError.Inactive("Car");
  if (!area.isActive) throw ApiError.Inactive("Area");
  if (!jobProfile.isActive) throw ApiError.Inactive("Captain");

  return { subscription, car, area, jobProfile };
};

export const getLessonStats = (lessons: Lesson[]) => {
  const result: Record<LessonStatus, number> = {
    CANCELED: 0,
    CANCELED_CHARGED: 0,
    COMPLETED: 0,
    SCHEDULED: 0,
  };

  for (const lesson of lessons) {
    result[lesson.lessonStatus]++;
  }

  return result;
};

export const orderBy: LessonOrderByWithRelationInput = { startTime: "asc" }