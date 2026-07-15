"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLessonSchema = exports.UpdateLessonSchema = exports.ChangeLessonStateSchema = exports.GetLessonDetailsSchema = exports.GetAllLessonsSchema = exports.CreateLessonSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.CreateLessonSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
    }),
    body: zod_1.default.object({
        startTime: common_validation_1.date,
        transmission: common_validation_1.transmission,
        expectedPaymentAmount: common_validation_1.price.optional(),
        jobProfileId: common_validation_1.id,
        carId: common_validation_1.id,
        areaId: common_validation_1.id,
        subscriptionId: common_validation_1.id,
    }),
};
exports.GetAllLessonsSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
    }),
    query: zod_1.default.object({
        page: common_validation_1.page,
        limit: common_validation_1.limit,
        transmission: common_validation_1.transmission.optional(),
        lessonStatus: common_validation_1.lessonStatus.optional(),
        search: zod_1.default.string().optional(),
        startTime: common_validation_1.date.optional(),
        endTime: common_validation_1.date.optional(),
    }),
};
exports.GetLessonDetailsSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
        lessonId: common_validation_1.id,
    }),
};
exports.ChangeLessonStateSchema = {
    params: zod_1.default.object({ lessonId: common_validation_1.id, academyId: common_validation_1.id }),
    body: zod_1.default.object({
        lessonStatus: common_validation_1.lessonStatus,
        amount: common_validation_1.price.optional()
    })
};
exports.UpdateLessonSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
        lessonId: common_validation_1.id,
    }),
    body: zod_1.default.object({
        startTime: common_validation_1.date.optional(),
        transmission: common_validation_1.transmission.optional(),
        expectedPaymentAmount: common_validation_1.price.optional(),
        jobProfileId: common_validation_1.id.optional(),
        carId: common_validation_1.id.optional(),
        areaId: common_validation_1.id.optional(),
    }),
};
exports.DeleteLessonSchema = {
    params: zod_1.default.object({ lessonId: common_validation_1.id, academyId: common_validation_1.id }),
};
