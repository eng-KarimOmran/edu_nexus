"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBy = exports.validateAreaTransition = exports.getLessonStats = exports.getValidatedLessonDependencies = exports.validateTimeSlotConflict = exports.getBookingError = exports.buildLessonWhere = exports.calculateLessonTime = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const calculateLessonTime = (startTime, durationMinutes) => {
    const start = (0, dayjs_1.default)(startTime);
    const end = start.add(durationMinutes, "minute");
    return {
        startTime: start.toDate(),
        endTime: end.toDate(),
    };
};
exports.calculateLessonTime = calculateLessonTime;
const buildLessonWhere = ({ search, academyId, lessonStatus, transmission, startTime, endTime }) => {
    const where = { academyId };
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
exports.buildLessonWhere = buildLessonWhere;
const getBookingError = (status) => {
    switch (status) {
        case "PENDING_DEPOSIT":
            throw ApiError_1.default.BadRequest("لا يمكن جدولة حصة جديدة لأن الاشتراك لم يتم تفعيله بعد. يرجى سداد مبلغ العربون (الديبوزت) أولاً.");
        case "CANCELED":
            throw ApiError_1.default.BadRequest("لا يمكن جدولة حصة جديدة؛ هذا الاشتراك تم إلغاؤه مسبقاً.");
        case "COMPLETED":
            throw ApiError_1.default.BadRequest("لا يمكن جدولة حصة جديدة؛ لقد اكتملت جميع الحصص الخاصة بهذا الاشتراك.");
        case 'SUSPENDED':
            throw ApiError_1.default.BadRequest("لا يمكن جدولة حصة جديدة لأنه تم استهلاك جميع الحصص المسموح بها قبل السداد الكامل. يرجى استكمال سداد قيمة الاشتراك لإعادة تفعيل الاشتراك.");
        case 'FULLY_BOOKED':
            throw ApiError_1.default.BadRequest("لا يمكن جدولة حصة جديدة؛ لقد تم حجز جميع حصص هذا الاشتراك..");
    }
};
exports.getBookingError = getBookingError;
const validateTimeSlotConflict = async ({ id, tx, startTime, endTime, carId, jobProfileId, clientId, }) => {
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
        if (conflictingLesson.jobProfileId === jobProfileId)
            throw ApiError_1.default.Conflict("CAPTAIN_TIME_CONFLICT");
        if (conflictingLesson.carId === carId)
            throw ApiError_1.default.Conflict("CAR_TIME_CONFLICT");
        if (conflictingLesson.clientId === clientId)
            throw ApiError_1.default.Conflict("CLIENT_TIME_CONFLICT");
    }
};
exports.validateTimeSlotConflict = validateTimeSlotConflict;
const getValidatedLessonDependencies = async ({ tx, subscriptionId, carId, areaId, jobProfileId, transmission }) => {
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
    if (!subscription)
        throw ApiError_1.default.NotFound("Subscription");
    if (!jobProfile)
        throw ApiError_1.default.NotFound("Captain");
    if (!car)
        throw ApiError_1.default.NotFound("Car");
    if (!area)
        throw ApiError_1.default.NotFound("Area");
    if (!car.isActive)
        throw ApiError_1.default.Inactive("Car");
    if (!area.isActive)
        throw ApiError_1.default.Inactive("Area");
    if (!jobProfile.isActive)
        throw ApiError_1.default.Inactive("Captain");
    return { subscription, car, area, jobProfile };
};
exports.getValidatedLessonDependencies = getValidatedLessonDependencies;
const getLessonStats = (lessons) => {
    const result = {
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
exports.getLessonStats = getLessonStats;
const validateAreaTransition = async ({ tx, areaId, carId, jobProfileId, startTime, endTime, }) => {
    const ONE_HOUR = 60 * 60 * 1000;
    const checkTransition = async (where, resourceName) => {
        const previousLesson = await tx.lesson.findFirst({
            where: {
                ...where,
                lessonStatus: { not: "CANCELED" },
                endTime: { lte: startTime },
            },
            orderBy: {
                endTime: "desc",
            },
        });
        if (previousLesson &&
            previousLesson.areaId !== areaId &&
            startTime.getTime() - previousLesson.endTime.getTime() < ONE_HOUR) {
            throw ApiError_1.default.Conflict("TRANSITIONING", `يجب ترك ساعة انتقال لل${resourceName} بين المنطقتين.`);
        }
        const nextLesson = await tx.lesson.findFirst({
            where: {
                ...where,
                lessonStatus: { not: "CANCELED" },
                startTime: { gte: endTime },
            },
            orderBy: {
                startTime: "asc",
            },
        });
        if (nextLesson &&
            nextLesson.areaId !== areaId &&
            nextLesson.startTime.getTime() - endTime.getTime() < ONE_HOUR) {
            throw ApiError_1.default.Conflict("TRANSITIONING", `يجب ترك ساعة انتقال لل${resourceName} بين المنطقتين.`);
        }
    };
    await checkTransition({ carId }, "عربية");
    await checkTransition({ jobProfileId }, "كابتن");
};
exports.validateAreaTransition = validateAreaTransition;
exports.orderBy = { startTime: "asc" };
