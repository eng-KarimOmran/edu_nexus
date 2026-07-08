"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const area_service_1 = __importDefault(require("./area.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const AreaController = {
    createArea: async (req, res) => {
        const dataSafe = req.dataSafe;
        const area = await area_service_1.default.createArea(dataSafe);
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: area,
            message: "تم إنشاء المنطقة بنجاح",
        });
    },
    updateArea: async (req, res) => {
        const dataSafe = req.dataSafe;
        const area = await area_service_1.default.updateArea(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: area,
            message: "تم تحديث المنطقة بنجاح",
        });
    },
    deleteArea: async (req, res) => {
        const dataSafe = req.dataSafe;
        await area_service_1.default.deleteArea(dataSafe);
        return (0, successResponse_1.default)({
            res,
            message: "تم حذف المنطقة بنجاح",
        });
    },
    getAllAreas: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await area_service_1.default.getAllAreas(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
        });
    },
    getAreaDetails: async (req, res) => {
        const dataSafe = req.dataSafe;
        const area = await area_service_1.default.getAreaDetails(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: area,
        });
    },
};
exports.default = AreaController;
