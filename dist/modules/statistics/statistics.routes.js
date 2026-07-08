"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const academy_middleware_1 = require("../academy/academy.middleware");
const validate_middleware_1 = __importDefault(require("../../shared/middlewares/validate.middleware"));
const statistics_schema_1 = require("./statistics.schema");
const statistics_controller_1 = __importDefault(require("./statistics.controller"));
const router = (0, express_1.Router)({ mergeParams: true });
router.use((0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }));
router.get("/", (0, validate_middleware_1.default)(statistics_schema_1.GetDashboardAnalyticsSchema), statistics_controller_1.default.getStatistics);
exports.default = router;
