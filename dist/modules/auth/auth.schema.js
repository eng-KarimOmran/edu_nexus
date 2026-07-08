"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFirstUserSchema = exports.changePasswordSchema = exports.LogoutSchema = exports.LoginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.LoginSchema = {
    body: zod_1.default.object({ phone: common_validation_1.phone, password: common_validation_1.password }),
};
exports.LogoutSchema = {
    query: zod_1.default.object({ allDevices: common_validation_1.booleanQuery.optional().default(false) }),
};
exports.changePasswordSchema = {
    body: zod_1.default.object({
        currentPassword: common_validation_1.password,
        newPassword: common_validation_1.password,
    }),
};
exports.createFirstUserSchema = {
    body: zod_1.default.object({
        name: common_validation_1.personName,
        phone: common_validation_1.phone,
        email: zod_1.default.email().optional()
    }),
};
