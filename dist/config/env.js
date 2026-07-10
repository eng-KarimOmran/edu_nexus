"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isDevelopment = process.env.NODE_ENV === "development";
const env = {
    app: {
        PORT: Number(process.env.PORT),
        nodeEnv: process.env.NODE_ENV ?? "development",
        corsOrigins: isDevelopment
            ? process.env.CORS_ORIGINS_DEVELOPER
            : process.env.CORS_ORIGINS,
        DEFAULT_USER_PASSWORD: process.env.DEFAULT_USER_PASSWORD,
    },
    db: {
        URL_DB: isDevelopment
            ? process.env.URL_DB_DEVELOPER
            : process.env.URL_DB,
    },
    token: {
        ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        ACCESS_EXPIRATION: Number(process.env.JWT_ACCESS_EXPIRATION),
        REFRESH_EXPIRATION: Number(process.env.JWT_REFRESH_EXPIRATION),
    },
};
exports.default = env;
