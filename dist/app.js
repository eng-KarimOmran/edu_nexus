"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("./config/env"));
const notfound_middleware_1 = require("./shared/middlewares/notfound.middleware");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errors_middleware_1 = __importDefault(require("./shared/middlewares/errors.middleware"));
const index_routes_1 = __importDefault(require("./index.routes"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const express_rate_limit_1 = require("express-rate-limit");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.default.app.corsOrigins.split(","),
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json({
    limit: "100kb",
}));
app.use((0, cookie_parser_1.default)());
app.use((0, hpp_1.default)());
app.use((0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "لاحظنا استخدام غير طبيعي حاول في وقت آخر",
    },
}));
app.use("/api/v1", index_routes_1.default);
const clientPath = path_1.default.resolve(process.cwd(), "./client/dist");
app.use(express_1.default.static(clientPath));
app.get("/{*path}", (_, res) => {
    res.sendFile(path_1.default.join(clientPath, "index.html"));
});
app.use(notfound_middleware_1.notFoundRouter);
app.use(errors_middleware_1.default);
exports.default = app;
