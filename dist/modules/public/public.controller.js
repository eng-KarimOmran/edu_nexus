"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const public_service_1 = __importDefault(require("./public.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const PublicController = {
    async getAcademy(req, res) {
        const dataSafe = req.dataSafe;
        const academy = await public_service_1.default.getAcademy(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: academy,
        });
    },
    async getCourses(req, res) {
        const dataSafe = req.dataSafe;
        const courses = await public_service_1.default.getCourses(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: courses,
        });
    },
    async getAreas(req, res) {
        const dataSafe = req.dataSafe;
        const areas = await public_service_1.default.getAreas(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: areas,
        });
    },
    async getClient(req, res) {
        const dataSafe = req.dataSafe;
        const client = await public_service_1.default.getClient(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: client,
        });
    },
    async register(req, res) {
        const dataSafe = req.dataSafe;
        const result = await public_service_1.default.register(dataSafe);
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: result,
            message: "تم التسجيل بنجاح",
        });
    },
    async getCaptains(req, res) {
        const result = await public_service_1.default.getCaptains();
        return (0, successResponse_1.default)({
            res,
            data: result,
        });
    }
};
exports.default = PublicController;
