"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllCarAndLessonSchema = exports.getClientSchema = exports.getAllLessonsSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.getAllLessonsSchema = {
    query: zod_1.default.object({
        lessonStatus: common_validation_1.lessonStatus.optional(),
        startTime: common_validation_1.date,
        endTime: common_validation_1.date,
        jobProfileId: common_validation_1.id.optional()
    })
};
exports.getClientSchema = {
    query: zod_1.default.object({
        search: zod_1.default.string().min(11),
    })
};
exports.GetAllCarAndLessonSchema = {
    query: zod_1.default.object({
        startTime: common_validation_1.date,
        endTime: common_validation_1.date,
    }),
};
