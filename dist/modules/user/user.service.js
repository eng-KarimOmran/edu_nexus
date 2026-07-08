"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const auth_utils_1 = require("../auth/auth.utils");
const env_1 = __importDefault(require("../../config/env"));
const user_utils_1 = require("./user.utils");
const dayjs_1 = __importDefault(require("dayjs"));
const Pagination_1 = require("../../shared/utils/Pagination");
const UserService = {
    async createUser({ body }) {
        const { name, phone } = body;
        const userExPhone = await prisma_1.prisma.user.findUnique({
            where: { phone },
        });
        if (userExPhone)
            throw ApiError_1.default.Conflict("PHONE_ALREADY_EXISTS");
        const hashPassword = await auth_utils_1.HashHelper.hash(env_1.default.app.DEFAULT_USER_PASSWORD);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                phone,
                password: hashPassword,
            },
        });
        return (0, user_utils_1.userSafe)(user);
    },
    async updateUser(dataSafe, currentUser) {
        const { params, body } = dataSafe;
        const { userId } = params;
        const targetUser = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!targetUser)
            throw ApiError_1.default.NotFound("User");
        (0, user_utils_1.assertCanModifyUser)({ currentUser, targetUser });
        if (body.phone && body.phone !== targetUser.phone) {
            const phoneExists = await prisma_1.prisma.user.findUnique({
                where: { phone: body.phone },
            });
            if (phoneExists) {
                throw ApiError_1.default.Conflict("PHONE_ALREADY_EXISTS");
            }
        }
        if (body.email && body.email !== targetUser.email) {
            const emailExists = await prisma_1.prisma.user.findUnique({
                where: { email: body.email },
            });
            if (emailExists) {
                throw ApiError_1.default.Conflict("EMAIL_ALREADY_EXISTS");
            }
        }
        const user = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: body,
        });
        return (0, user_utils_1.userSafe)(user);
    },
    async deleteUser(dataSafe, currentUser) {
        const { params } = dataSafe;
        const { userId } = params;
        const targetUser = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!targetUser)
            throw ApiError_1.default.NotFound("User");
        (0, user_utils_1.assertCanModifyUser)({ currentUser, targetUser });
        const user = await prisma_1.prisma.user.delete({
            where: { id: userId },
        });
        return (0, user_utils_1.userSafe)(user);
    },
    async getAllUsers(dataSafe) {
        const { limit, page, ...filters } = dataSafe.query;
        const pagination = (0, Pagination_1.buildPagination)({ page, limit });
        const where = (0, user_utils_1.buildUserWhere)(filters);
        const { users, count } = await prisma_1.prisma.$transaction(async (tx) => {
            const [users, count] = await Promise.all([
                tx.user.findMany({ where, ...pagination, orderBy: user_utils_1.orderBy }),
                tx.user.count({ where })
            ]);
            return { users, count };
        });
        const usersSafe = users.map((u) => (0, user_utils_1.userSafe)(u));
        const paginationMeta = (0, Pagination_1.buildPaginationMeta)({ limit, page, count });
        return { items: usersSafe, pagination: paginationMeta };
    },
    async getUserDetails({ params }) {
        const { userId } = params;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                academies: true,
                jobProfile: true
            },
        });
        if (!user)
            throw ApiError_1.default.NotFound("User");
        return (0, user_utils_1.userSafe)(user);
    },
    async newPassword(dataSafe, currentUser) {
        const { params, body } = dataSafe;
        const { userId } = params;
        const { newPassword } = body;
        const targetUser = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!targetUser)
            throw ApiError_1.default.NotFound("User");
        (0, user_utils_1.assertCanModifyUser)({ currentUser, targetUser });
        const hashPassword = await auth_utils_1.HashHelper.hash(newPassword);
        const user = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashPassword,
                isPasswordChanged: false,
                logoutAt: (0, dayjs_1.default)().toDate(),
            },
        });
        return (0, user_utils_1.userSafe)(user);
    },
};
exports.default = UserService;
