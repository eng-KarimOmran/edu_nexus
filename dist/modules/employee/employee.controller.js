"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const employee_service_1 = __importDefault(require("./employee.service"));
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const EmployeeController = {
    getJobProfileDebts: async (req, res) => {
        const jobProfile = req.jobProfile;
        if (!jobProfile)
            throw ApiError_1.default.BadRequest("ليس لديك ملف وظيفي");
        const wallets = await employee_service_1.default.getJobProfileDebts({ jobProfileId: jobProfile.id });
        return (0, successResponse_1.default)({ res, data: wallets });
    },
    getAllLessons: async (req, res) => {
        const dataSafe = req.dataSafe;
        const lessons = await employee_service_1.default.getAllLessons(dataSafe);
        return (0, successResponse_1.default)({ res, data: lessons });
    },
    getClient: async (req, res) => {
        const dataSafe = req.dataSafe;
        const client = await employee_service_1.default.getClient(dataSafe);
        return (0, successResponse_1.default)({ res, data: client });
    },
    getEmployeesWithDebts: async (_, res) => {
        const jobProfiles = await employee_service_1.default.getEmployeesWithDebts();
        return (0, successResponse_1.default)({ res, data: jobProfiles });
    }
};
exports.default = EmployeeController;
