"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobProfile_routes_1 = __importDefault(require("../jobProfile/jobProfile.routes"));
const area_routes_1 = __importDefault(require("../area/area.routes"));
const car_routes_1 = __importDefault(require("../car/car.routes"));
const user_routes_1 = __importDefault(require("../user/user.routes"));
const payroll_routes_1 = __importDefault(require("../payroll/payroll.routes"));
const router = (0, express_1.Router)();
router.use("/job-profile", jobProfile_routes_1.default);
router.use("/car", car_routes_1.default);
router.use("/area", area_routes_1.default);
router.use("/users", user_routes_1.default);
router.use("/payroll", payroll_routes_1.default);
exports.default = router;
