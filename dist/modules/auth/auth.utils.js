"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieAccess = exports.cookieRefresh = exports.Token = exports.HashHelper = void 0;
const argon2 = __importStar(require("argon2"));
const nanoid_1 = require("nanoid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../config/env"));
exports.HashHelper = {
    async hash(password) {
        return argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 4,
            parallelism: 2,
        });
    },
    async compare({ plainPassword, hashedPassword }) {
        try {
            return await argon2.verify(hashedPassword, plainPassword);
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
