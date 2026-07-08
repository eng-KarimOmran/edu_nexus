"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const car_service_1 = __importDefault(require("./car.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const CarController = {
    createCar: async (req, res) => {
        const dataSafe = req.dataSafe;
        const car = await car_service_1.default.createCar(dataSafe);
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: car,
            message: "تم إنشاء السيارة بنجاح",
        });
    },
    updateCar: async (req, res) => {
        const dataSafe = req.dataSafe;
        const car = await car_service_1.default.updateCar(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: car,
            message: "تم تحديث السيارة بنجاح",
        });
    },
    deleteCar: async (req, res) => {
        const dataSafe = req.dataSafe;
        await car_service_1.default.deleteCar(dataSafe);
        return (0, successResponse_1.default)({
            res,
            message: "تم حذف السيارة بنجاح",
        });
    },
    getAllCars: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await car_service_1.default.getAllCars(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
        });
    },
    getDetails: async (req, res) => {
        const dataSafe = req.dataSafe;
        const car = await car_service_1.default.getDetails(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: car,
        });
    },
};
exports.default = CarController;
