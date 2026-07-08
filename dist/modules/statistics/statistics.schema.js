"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDashboardAnalyticsSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("../../shared/utils/common.validation");
exports.GetDashboardAnalyticsSchema = {
    params: zod_1.z.object({ academyId: common_validation_1.id }),
    query: zod_1.z.object({ startDate: common_validation_1.date, endDate: common_validation_1.date }),
};
