"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const auth_utils_1 = require("./auth.utils");
const AuthController = {
    login: async (req, res) => {
        const dataSafe = req.dataSafe;
        const { body } = dataSafe;
        const { tokens, user } = await auth_service_1.default.login(body);
        res.cookie("access", tokens.access, auth_utils_1.cookieAccess);
        res.cookie("refresh", tokens.refresh, auth_utils_1.cookieRefresh);
        return (0, successResponse_1.default)({
            res,
            data: { tokens, user },
            message: "تم تسجيل الدخول بنجاح",
        });
    },
    refresh: async (req, res) => {
        const userLogin = req.userLogin;
        const jti = req.tokenPayload.jti;
        const { access, user } = auth_service_1.default.refresh({ userLogin, jti });
        res.cookie("access", access, auth_utils_1.cookieAccess);
        return (0, successResponse_1.default)({
            res,
            data: { access, user },
            message: "تم تجديد صلاحية الدخول بنجاح",
        });
    },
    logout: async (req, res) => {
        const dataSafe = req.dataSafe;
        const { allDevices } = dataSafe.query;
        const userId = req.userLogin.id;
        const { jti, exp } = req.tokenPayload;
        await auth_service_1.default.logout({ allDevices, exp, jti, userId });
        res.clearCookie("access", auth_utils_1.cookieAccess);
        res.clearCookie("refresh", auth_utils_1.cookieRefresh);
        return (0, successResponse_1.default)({
            res,
            data: true,
            message: "تم تسجيل الخروج بنجاح",
        });
    },
    changePassword: async (req, res) => {
        const { password, id } = req.userLogin;
        const dataSafe = req.dataSafe;
        const { body } = dataSafe;
        await auth_service_1.default.changePassword({ ...body, password, userId: id });
        res.clearCookie("access", auth_utils_1.cookieAccess);
        res.clearCookie("refresh", auth_utils_1.cookieRefresh);
        return (0, successResponse_1.default)({
            res,
            data: true,
            message: "تم تغيير كلمة المرور بنجاح",
        });
    },
    createFirstUser: async (req, res) => {
        const dataSafe = req.dataSafe;
        const body = dataSafe.body;
        const data = await auth_service_1.default.createFirstUser(body);
        res.clearCookie("access", auth_utils_1.cookieAccess);
        res.clearCookie("refresh", auth_utils_1.cookieRefresh);
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data,
            message: "تم إنشاء المستخدم بنجاح",
        });
    },
};
exports.default = AuthController;
