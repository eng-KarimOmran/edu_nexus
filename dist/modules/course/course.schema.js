"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCourseFeaturesSchema = exports.AddCourseFeaturesSchema = exports.GetDetailsSchema = exports.GetAllSchema = exports.DeleteSchema = exports.UpdateSchema = exports.CreateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.CreateSchema = {
    params: zod_1.default.object({ academyId: common_validation_1.id }),
    body: zod_1.default
        .object({
        name: common_validation_1.entityName,
        description: zod_1.default.string(),
        priceOriginal: common_validation_1.price,
        priceDiscounted: common_validation_1.price,
        requiredInitialDeposit: common_validation_1.price.default(50),
        sessionsBeforeFullPayment: common_validation_1.price,
        sessionDurationMinutes: common_validation_1.positiveNumber.default(50),
        totalSessions: common_validation_1.positiveNumber,
        featuredReason: zod_1.default.string().optional(),
    })
        .refine((data) => data.priceOriginal >= data.priceDiscounted, {
        error: "السعر بعد الخصم يجب أن يكون أقل من أو يساوي السعر الأصلي",
        path: ["priceDiscounted"],
    }),
};
exports.UpdateSchema = {
    params: zod_1.default.object({ courseId: common_validation_1.id, academyId: common_validation_1.id }),
    body: zod_1.default.object({
        name: common_validation_1.entityName.optional(),
        description: zod_1.default.string().optional(),
        priceOriginal: common_validation_1.price.optional(),
        priceDiscounted: common_validation_1.price.optional(),
        requiredInitialDeposit: common_validation_1.price.optional(),
        sessionsBeforeFullPayment: common_validation_1.price.optional(),
        totalSessions: common_validation_1.positiveNumber.optional(),
        sessionDurationMinutes: common_validation_1.positiveNumber.optional(),
        featuredReason: zod_1.default.string().optional(),
        isActive: common_validation_1.boolean.optional(),
    }).refine((data) => {
        if (data.priceOriginal !== undefined && data.priceDiscounted !== undefined) {
            return data.priceOriginal >= data.priceDiscounted;
        }
        return true;
    }, {
        message: "السعر بعد الخصم يجب أن يكون أقل من أو يساوي السعر الأصلي",
        path: ["priceDiscounted"],
    }),
};
exports.DeleteSchema = {
    params: zod_1.default.object({ courseId: common_validation_1.id, academyId: common_validation_1.id }),
};
exports.GetAllSchema = {
    params: zod_1.default.object({ academyId: common_validation_1.id }),
    query: zod_1.default.object({
        page: common_validation_1.page,
        limit: common_validation_1.limit,
        search: zod_1.default.string().optional(),
        isActive: common_validation_1.booleanQuery.optional(),
    }),
};
exports.GetDetailsSchema = {
    params: zod_1.default.object({ courseId: common_validation_1.id, academyId: common_validation_1.id }),
};
exports.AddCourseFeaturesSchema = {
    params: zod_1.default.object({ academyId: common_validation_1.id, courseId: common_validation_1.id }),
    body: zod_1.default.object({
        text: zod_1.default.string(),
    }),
};
exports.DeleteCourseFeaturesSchema = {
    params: zod_1.default.object({ academyId: common_validation_1.id, courseId: common_validation_1.id, featureId: common_validation_1.id }),
};
