"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jobProfile_service_1 = __importDefault(require("./jobProfile.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const JobProfileController = {
    createJobProfile: async (req, res) => {
        const dataSafe = req.dataSafe;
        const jobProfile = await jobProfile_service_1.default.createJobProfile(dataSafe);
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: jobProfile,
            message: "تم إنشاء الملف الوظيفي بنجاح",
        });
    },
    updateJobProfile: async (req, res) => {
        const dataSafe = req.dataSafe;
        const jobProfile = await jobProfile_service_1.default.updateJobProfile(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: jobProfile,
            message: "تم تحديث الملف الوظيفي بنجاح",
        });
    },
    deleteJobProfile: async (req, res) => {
        const dataSafe = req.dataSafe;
        await jobProfile_service_1.default.deleteJobProfile(dataSafe);
        return (0, successResponse_1.default)({
            res,
            message: "تم حذف الملف الوظيفي بنجاح",
        });
    },
    getAllJobProfiles: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await jobProfile_service_1.default.getAllJobProfiles(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
        });
    },
    getJobProfileDetails: async (req, res) => {
        const dataSafe = req.dataSafe;
        const jobProfile = await jobProfile_service_1.default.getJobProfileDetails(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: jobProfile,
        });
    },
};
exports.default = JobProfileController;
