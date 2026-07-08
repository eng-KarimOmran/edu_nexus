"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSafe = exports.orderBy = exports.buildUserWhere = exports.assertCanModifyUser = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const omit_1 = require("../../shared/utils/omit");
const assertCanModifyUser = ({ currentUser, targetUser, }) => {
    if (currentUser.id === targetUser.id)
        return;
    const currentIsNewer = (0, dayjs_1.default)(currentUser.createdAt).isAfter((0, dayjs_1.default)(targetUser.createdAt));
    if (currentIsNewer) {
        throw ApiError_1.default.Forbidden();
    }
};
exports.assertCanModifyUser = assertCanModifyUser;
const buildUserWhere = ({ search, isActive, isAdmin }) => {
    const where = {};
    if (search) {
        where.OR = [
            { name: { contains: search, } },
            { phone: { contains: search } },
        ];
    }
    if (typeof isActive === "boolean") {
        where.isActive = isActive;
    }
    if (typeof isAdmin === "boolean") {
        where.isAdmin = isAdmin;
    }
    return where;
};
exports.buildUserWhere = buildUserWhere;
exports.orderBy = { createdAt: "desc" };
const userSafe = (user) => (0, omit_1.omit)(user, ["password", "logoutAt"]);
exports.userSafe = userSafe;
