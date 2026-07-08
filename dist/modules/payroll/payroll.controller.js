"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payroll_service_1 = __importDefault(require("./payroll.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const PayrollController = {
    createPayroll: async (req, res) => {
        const dataSafe = req.dataSafe;
        const payroll = await payroll_service_1.default.createPayroll(dataSafe);
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: payroll,
            message: "تم إنشاء الراتب بنجاح",
        });
    },
    deletePayroll: async (req, res) => {
        const dataSafe = req.dataSafe;
        await payroll_service_1.default.deletePayroll(dataSafe);
        return (0, successResponse_1.default)({
            res,
            message: "تم حذف الراتب بنجاح",
        });
    },
    getAllPayroll: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await payroll_service_1.default.getAllPayroll(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data
        });
    }
};
exports.default = PayrollController;
