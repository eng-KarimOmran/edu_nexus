"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardTimeFrames = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const getDashboardTimeFrames = ({ startDate, endDate, }) => {
    const now = (0, dayjs_1.default)();
    const start = startDate
        ? (0, dayjs_1.default)(startDate).startOf("day").toDate()
        : now.startOf("day").toDate();
    const end = endDate
        ? (0, dayjs_1.default)(endDate).endOf("day").toDate()
        : now.endOf("day").toDate();
    return {
        operational: {
            gte: start,
            lte: end,
        },
        financial: {
            gte: start,
            lte: end,
        },
    };
};
exports.getDashboardTimeFrames = getDashboardTimeFrames;
