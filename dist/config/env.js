"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = {
    app: {
        PORT: Number(process.env.PORT) || 3000,
        nodeEnv: process.env.NODE_ENV,
        corsOrigins: process.env.CORS_ORIGINS,
        DEFAULT_USER_PASSWORD: process.env.DEFAULT_USER_PASSWORD,
    },
    db: {
        URL_DB: process.env.URL_DB,
    },
    token: {
        ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        REFRESH_EXPIRATION: Number(process.env.JWT_REFRESH_EXPIRATION),
        ACCESS_EXPIRATION: Number(process.env.JWT_ACCESS_EXPIRATION),
    }
};
exports.default = env;
