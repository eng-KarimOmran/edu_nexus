"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const UserController = {
    createUser: async (req, res) => {
        const dataSafe = req.dataSafe;
        const user = await user_service_1.default.createUser({ body: dataSafe.body });
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: user,
            message: "تم إنشاء المستخدم بنجاح",
        });
    },
    updateUser: async (req, res) => {
        const currentUser = req.userLogin;
        const dataSafe = req.dataSafe;
        const updatedUser = await user_service_1.default.updateUser(dataSafe, currentUser);
        return (0, successResponse_1.default)({
            res,
            data: updatedUser,
            message: "تم تحديث المستخدم بنجاح",
        });
    },
    deleteUser: async (req, res) => {
        const currentUser = req.userLogin;
        const dataSafe = req.dataSafe;
        await user_service_1.default.deleteUser(dataSafe, currentUser);
        return (0, successResponse_1.default)({
            res,
            message: "تم حذف المستخدم نهائيًا",
        });
    },
    getAllUser: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await user_service_1.default.getAllUsers(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
        });
    },
    getDetailsUser: async (req, res) => {
        const dataSafe = req.dataSafe;
        const user = await user_service_1.default.getUserDetails(dataSafe);
        return (0, successResponse_1.default)({ res, data: user });
    },
    newPassword: async (req, res) => {
        const dataSafe = req.dataSafe;
        const currentUser = req.userLogin;
        const user = await user_service_1.default.newPassword(dataSafe, currentUser);
        return (0, successResponse_1.default)({ res, data: user });
    }
};
exports.default = UserController;
