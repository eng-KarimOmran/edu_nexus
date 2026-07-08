"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieAccess = exports.cookieRefresh = exports.Token = exports.HashHelper = void 0;
const nanoid_1 = require("nanoid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../config/env"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.HashHelper = {
    async hash(password) {
        const saltRounds = 12;
        return await bcrypt_1.default.hash(password, saltRounds);
    },
    async compare({ plainPassword, hashedPassword, }) {
        try {
            return await bcrypt_1.default.compare(plainPassword, hashedPassword);
        }
        catch (error) {
            console.error("HashHelper compare error:", error);
            return false;
        }
    },
};
exports.Token = {
    generateTokens: (userId) => {
        const { ACCESS_EXPIRATION, ACCESS_SECRET, REFRESH_EXPIRATION, REFRESH_SECRET, } = env_1.default.token;
        const jti = (0, nanoid_1.nanoid)();
        const access = jsonwebtoken_1.default.sign({}, ACCESS_SECRET, {
            expiresIn: ACCESS_EXPIRATION,
            jwtid: jti,
            subject: userId
        });
        const refresh = jsonwebtoken_1.default.sign({}, REFRESH_SECRET, {
            expiresIn: REFRESH_EXPIRATION,
            jwtid: jti,
            subject: userId
        });
        return { access, refresh };
    },
    verifyToken: ({ type, token }) => {
        const { ACCESS_SECRET, REFRESH_SECRET } = env_1.default.token;
        const secret = type === "ACCESS" ? ACCESS_SECRET : REFRESH_SECRET;
        try {
            const payload = jsonwebtoken_1.default.verify(token, secret);
            return { payload };
        }
        catch (err) {
            return { payload: undefined };
        }
    },
    generateAccessToken: (userId, jti) => {
        const { ACCESS_SECRET, ACCESS_EXPIRATION } = env_1.default.token;
        const access = jsonwebtoken_1.default.sign({}, ACCESS_SECRET, {
            expiresIn: ACCESS_EXPIRATION,
            jwtid: jti,
            subject: userId
        });
        return access;
    }
};
const cookieOptions = {
    httpOnly: true,
    secure: env_1.default.app.nodeEnv === "production",
    sameSite: "strict",
    path: "/",
};
exports.cookieRefresh = {
    ...cookieOptions,
    path: "/api/v1/auth",
    maxAge: env_1.default.token.REFRESH_EXPIRATION,
};
exports.cookieAccess = {
    ...cookieOptions,
    maxAge: env_1.default.token.ACCESS_EXPIRATION,
};
