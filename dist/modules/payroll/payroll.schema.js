"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSchemaPayroll = exports.deletePayrollSchema = exports.createPayrollSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("../../shared/utils/common.validation");
exports.createPayrollSchema = {
    body: zod_1.z.object({
        jobProfileId: common_validation_1.id,
        academyId: common_validation_1.id,
        baseSalary: common_validation_1.price,
        subscriptionsAmount: common_validation_1.price,
        bonusAmount: common_validation_1.number,
        lessonsAmount: common_validation_1.price,
        deductions: common_validation_1.price,
    }),
};
exports.deletePayrollSchema = {
    params: zod_1.z.object({
        payrollId: common_validation_1.id,
    }),
};
exports.getAllSchemaPayroll = {
    params: zod_1.z.object({
        jobProfileId: common_validation_1.id,
    }),
    query: zod_1.z.object({
        page: common_validation_1.page,
        limit: common_validation_1.limit,
    }),
};
