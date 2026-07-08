"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelSubscriptionSchema = exports.DeleteSubscriptionSchema = exports.GetSubscriptionDetailsSchema = exports.GetAllSubscriptionsSchema = exports.CreateSubscriptionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.CreateSubscriptionSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
    }),
    body: zod_1.default.object({
        clientId: common_validation_1.id,
        courseId: common_validation_1.id,
        areaId: common_validation_1.id,
        trainingTypeAtRegistration: common_validation_1.transmission,
    }),
};
exports.GetAllSubscriptionsSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
    }),
    query: zod_1.default.object({
        page: common_validation_1.page,
        limit: common_validation_1.limit,
        search: zod_1.default.string().optional(),
        subscriptionStatus: common_validation_1.subscriptionStatus.optional(),
    }),
};
exports.GetSubscriptionDetailsSchema = {
    params: zod_1.default.object({ subscriptionId: common_validation_1.id, academyId: common_validation_1.id }),
};
exports.DeleteSubscriptionSchema = {
    params: zod_1.default.object({
        subscriptionId: common_validation_1.id,
        academyId: common_validation_1.id,
    }),
};
exports.CancelSubscriptionSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
        subscriptionId: common_validation_1.id,
    }),
};
