"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statistics_service_1 = __importDefault(require("./statistics.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const DashboardController = {
    getStatistics: async (req, res) => {
        const dataSafe = req.dataSafe;
        const [clients, courses, subscriptions, ledgerTransaction, lessons, area, car, captain, usersCreatedSubscription,] = await Promise.all([
            statistics_service_1.default.clients({ dataSafe }),
            statistics_service_1.default.courses({ dataSafe }),
            statistics_service_1.default.subscriptions({ dataSafe }),
            statistics_service_1.default.ledgerTransaction({ dataSafe }),
            statistics_service_1.default.lessons({ dataSafe }),
            statistics_service_1.default.area({ dataSafe }),
            statistics_service_1.default.car({ dataSafe }),
            statistics_service_1.default.captain({ dataSafe }),
            statistics_service_1.default.usersCreatedSubscription({ dataSafe }),
        ]);
        return (0, successResponse_1.default)({
            res,
            data: {
                clients,
                courses,
                subscriptions,
                ledgerTransaction,
                lessons,
                area,
                car,
                captain,
                usersCreatedSubscription,
            },
            message: "تم توليد وتحليل بيانات لوحة التحكم بنجاح.",
        });
    },
};
exports.default = DashboardController;
