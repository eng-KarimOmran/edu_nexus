"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscription_service_1 = __importDefault(require("./subscription.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const SubscriptionController = {
    createSubscription: async (req, res) => {
        const dataSafe = req.dataSafe;
        const userId = req.userLogin.id;
        const subscription = await subscription_service_1.default.createSubscription({ data: dataSafe, userId });
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: subscription,
            message: "تم إنشاء الاشتراك بنجاح",
        });
    },
    getAllSubscriptions: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await subscription_service_1.default.getAllSubscriptions(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
        });
    },
    getSubscriptionDetails: async (req, res) => {
        const dataSafe = req.dataSafe;
        const subscription = await subscription_service_1.default.getSubscriptionDetails(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: subscription,
        });
    },
    deleteSubscription: async (req, res) => {
        const dataSafe = req.dataSafe;
        const subscription = await subscription_service_1.default.deleteSubscription(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: subscription,
            message: "تم حذف الاشتراك بنجاح",
        });
    },
    cancelSubscription: async (req, res) => {
        const dataSafe = req.dataSafe;
        const subscription = await subscription_service_1.default.cancelSubscription(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: subscription,
            message: "تم إلغاء الاشتراك بنجاح",
        });
    },
};
exports.default = SubscriptionController;
