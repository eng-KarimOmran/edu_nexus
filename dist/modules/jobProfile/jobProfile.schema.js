"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllJobProfilesSchema = exports.getJobProfileDetailsSchema = exports.deleteJobProfileSchema = exports.updateJobProfileSchema = exports.createJobProfileSchema = void 0;
const common_validation_1 = require("../../shared/utils/common.validation");
const zod_1 = require("zod");
exports.createJobProfileSchema = {
    body: zod_1.z.object({
        userId: common_validation_1.id,
        jobProfileType: common_validation_1.jobProfileType,
        supportType: common_validation_1.supportType.optional(),
        baseSalary: common_validation_1.price.optional(),
        lessonPrice: common_validation_1.price.optional(),
        targetCount: common_validation_1.number.optional(),
        bonusAmount: common_validation_1.price.optional(),
    }),
};
exports.updateJobProfileSchema = {
    params: zod_1.z.object({
        jobProfileId: common_validation_1.id,
    }),
    body: zod_1.z.object({
        jobProfileType: common_validation_1.jobProfileType.optional(),
        supportType: common_validation_1.supportType.optional(),
        isActive: common_validation_1.boolean.optional(),
        baseSalary: common_validation_1.price.optional(),
        lessonPrice: common_validation_1.price.optional(),
        targetCount: common_validation_1.number.optional(),
        bonusAmount: common_validation_1.price.optional(),
    }),
};
exports.deleteJobProfileSchema = {
    params: zod_1.z.object({
        jobProfileId: common_validation_1.id,
    }),
};
exports.getJobProfileDetailsSchema = {
    params: zod_1.z.object({
        jobProfileId: common_validation_1.id,
    }),
};
exports.getAllJobProfilesSchema = {
    query: zod_1.z.object({
        page: common_validation_1.page,
        limit: common_validation_1.limit,
        search: zod_1.z.string().optional(),
        isActive: common_validation_1.booleanQuery.optional(),
        jobProfileType: common_validation_1.jobProfileType.optional(),
        supportType: common_validation_1.supportType.optional(),
    }),
};
