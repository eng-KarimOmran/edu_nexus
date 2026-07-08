"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPasswordSchema = exports.GetAllUsersSchema = exports.GetUserDetailsSchema = exports.DeleteUserSchema = exports.UpdateUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.CreateUserSchema = {
    body: zod_1.default.object({
        name: common_validation_1.personName,
        phone: common_validation_1.phone,
    }),
};
exports.UpdateUserSchema = {
    params: zod_1.default.object({ userId: common_validation_1.id }),
    body: zod_1.default.object({
        name: common_validation_1.personName.optional(),
        phone: common_validation_1.phone.optional(),
        email: zod_1.default.email().optional(),
        isActive: common_validation_1.boolean.optional(),
        isAdmin: common_validation_1.boolean.optional()
    }),
};
exports.DeleteUserSchema = {
    params: zod_1.default.object({ userId: common_validation_1.id }),
};
exports.GetUserDetailsSchema = {
    params: zod_1.default.object({ userId: common_validation_1.id }),
};
exports.GetAllUsersSchema = {
    query: zod_1.default.object({
        page: common_validation_1.page,
        limit: common_validation_1.limit,
        search: zod_1.default.string().optional(),
        isActive: common_validation_1.booleanQuery.optional(),
        isAdmin: common_validation_1.booleanQuery.optional()
    }),
};
exports.newPasswordSchema = {
    params: zod_1.default.object({ userId: common_validation_1.id }),
    body: zod_1.default.object({
        newPassword: common_validation_1.password,
    }),
};
