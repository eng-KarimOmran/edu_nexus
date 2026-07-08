"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const academy_service_1 = __importDefault(require("./academy.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const AcademyController = {
    create: async (req, res) => {
        const dataSafe = req.dataSafe;
        const academy = await academy_service_1.default.create(dataSafe);
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: academy,
            message: "تم إنشاء الأكاديمية بنجاح",
        });
    },
    myAcademics: async (req, res) => {
        const userId = req.userLogin.id;
        const data = await academy_service_1.default.myAcademics({ userId });
        return (0, successResponse_1.default)({
            res,
            data,
        });
    },
    update: async (req, res) => {
        const dataSafe = req.dataSafe;
        const updatedAcademy = await academy_service_1.default.update(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: updatedAcademy,
            message: "تم تحديث الأكاديمية بنجاح",
        });
    },
    delete: async (req, res) => {
        const dataSafe = req.dataSafe;
        await academy_service_1.default.delete(dataSafe);
        return (0, successResponse_1.default)({
            res,
            message: "تم حذف الأكاديمية بنجاح",
        });
    },
    getAll: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.getAll(dataSafe);
        return (0, successResponse_1.default)({ res, data });
    },
    getDetails: async (req, res) => {
        const dataSafe = req.dataSafe;
        const academy = await academy_service_1.default.getDetails(dataSafe);
        return (0, successResponse_1.default)({ res, data: academy });
    },
    addOwner: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.addOwner(dataSafe);
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data,
            message: "تم إضافة المالك بنجاح",
        });
    },
    deleteOwner: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.deleteOwner(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
            message: "تم حذف المالك بنجاح",
        });
    },
    addSocialMedia: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.addSocialMedia(dataSafe);
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data,
            message: "تم إضافة المنصة بنجاح",
        });
    },
    deleteSocialMedia: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.deleteSocialMedia(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
            message: "تم حذف المنصة بنجاح",
        });
    },
    addPhone: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.addPhone(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
            message: "تم اضافة رقم الهاتف بنجاح",
        });
    },
    deletePhone: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.deletePhone(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
            message: "تم حذف رقم الهاتف بنجاح",
        });
    },
    addAddress: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.addAddress(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
            message: "تم اضافة العنوان بنجاح",
        });
    },
    deleteAddress: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.deleteAddress(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
            message: "تم حذف العنوان بنجاح",
        });
    },
    addPaymentLink: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.addPaymentLink(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
            message: "تم اضافة رابط الدفع بنجاح",
        });
    },
    deletePaymentLink: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await academy_service_1.default.deletePaymentLink(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
            message: "تم حذف رابط الدفع بنجاح",
        });
    },
};
exports.default = AcademyController;
