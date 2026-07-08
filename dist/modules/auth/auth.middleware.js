"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPasswordChange = exports.auth = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const auth_utils_1 = require("./auth.utils");
const auth_type_1 = require("./auth.type");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const prisma_1 = require("../../lib/prisma");
const clearAuthCookies = (res) => {
    res.clearCookie("access", auth_utils_1.cookieAccess);
    res.clearCookie("refresh", auth_utils_1.cookieRefresh);
};
const auth = (type = auth_type_1.TokenType.ACCESS) => {
    return async (req, res, next) => {
        let token;
        const authHeader = req.headers.authorization;
        if (type === auth_type_1.TokenType.ACCESS) {
            token = req.cookies.access ?? authHeader;
        }
        else {
            token = req.cookies.refresh ?? authHeader;
        }
        if (!token)
            throw ApiError_1.default.Unauthorized();
        const { payload } = auth_utils_1.Token.verifyToken({ token, type });
        if (!payload?.sub)
            throw ApiError_1.default.Unauthorized();
        const [blacklistedToken, user] = await Promise.all([
            prisma_1.prisma.blacklistedToken.findUnique({
                where: { jti: payload.jti },
            }),
            prisma_1.prisma.user.findUnique({
                where: { id: payload.sub },
                include: { academies: true, jobProfile: true },
            }),
        ]);
        if (blacklistedToken) {
            clearAuthCookies(res);
            throw ApiError_1.default.Unauthorized();
        }
        if (!user) {
            clearAuthCookies(res);
            throw ApiError_1.default.NotFound("User");
        }
        if (!user.isActive) {
            clearAuthCookies(res);
            throw ApiError_1.default.AccountBlocked();
        }
        const logoutTime = user.logoutAt
            ? (0, dayjs_1.default)(user.logoutAt).unix()
            : 0;
        if (payload.iat && payload.iat < logoutTime) {
            clearAuthCookies(res);
            throw ApiError_1.default.Unauthorized();
        }
        req.tokenPayload = payload;
        req.userLogin = user;
        return next();
    };
};
exports.auth = auth;
const checkPasswordChange = async (req, _, next) => {
    const user = req.userLogin;
    if (!user)
        throw ApiError_1.default.Unauthorized();
    if (!user.isPasswordChanged) {
        throw ApiError_1.default.passwordChangeRequired();
    }
    return next();
};
exports.checkPasswordChange = checkPasswordChange;
