"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const auth_utils_1 = require("./auth.utils");
const env_1 = __importDefault(require("../../config/env"));
const user_utils_1 = require("../user/user.utils");
const AuthService = {
    async login({ phone, password }) {
        const userEx = await prisma_1.prisma.user.findUnique({
            where: { phone }, include: { academies: true, jobProfile: true },
        });
        if (!userEx)
            throw ApiError_1.default.InvalidCredentials();
        if (!userEx.isActive)
            throw ApiError_1.default.AccountBlocked();
        const isPasswordValid = await auth_utils_1.HashHelper.compare({ plainPassword: password, hashedPassword: userEx.password });
        if (!isPasswordValid)
            throw ApiError_1.default.InvalidCredentials();
        const { access, refresh } = auth_utils_1.Token.generateTokens(userEx.id);
        const user = (0, user_utils_1.userSafe)(userEx);
        return { user, tokens: { access, refresh } };
    },
    refresh({ userLogin, jti }) {
        const access = auth_utils_1.Token.generateAccessToken(userLogin.id, jti);
        const user = (0, user_utils_1.userSafe)(userLogin);
        return { user, access };
    },
    async logout({ allDevices, exp, userId, jti }) {
        const expiresAt = (0, dayjs_1.default)(exp).toDate();
        if (allDevices) {
            await prisma_1.prisma.user.update({ where: { id: userId }, data: { logoutAt: (0, dayjs_1.default)().toDate() } });
            return true;
        }
        await prisma_1.prisma.blacklistedToken.create({ data: { jti, expiresAt } });
        await prisma_1.prisma.blacklistedToken.deleteMany({ where: { expiresAt: { lt: (0, dayjs_1.default)().toDate() } } });
        return true;
    },
    async changePassword({ userId, password, newPassword, currentPassword }) {
        const isPasswordValid = await auth_utils_1.HashHelper.compare({ plainPassword: currentPassword, hashedPassword: password });
        if (!isPasswordValid)
            throw ApiError_1.default.InvalidCredentials({ password: true });
        const hashPassword = await auth_utils_1.HashHelper.hash(newPassword);
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashPassword, logoutAt: (0, dayjs_1.default)().toDate(), isPasswordChanged: true }
        });
        return true;
    },
    async createFirstUser({ name, phone, email }) {
        const user = await prisma_1.prisma.user.findFirst({ select: { id: true } });
        if (user)
            throw ApiError_1.default.Conflict("USER_ALREADY_EXISTS");
        const hashPassword = await auth_utils_1.HashHelper.hash(env_1.default.app.DEFAULT_USER_PASSWORD);
        const newUser = await prisma_1.prisma.user.create({ data: { name, phone, password: hashPassword, isAdmin: true, email } });
        return { id: newUser.id, phone };
    },
};
exports.default = AuthService;
