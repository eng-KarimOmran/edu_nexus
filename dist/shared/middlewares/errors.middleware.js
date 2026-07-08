"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (err, _, res, __) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "حدث خطأ ما";
    res.status(statusCode).send({
        status: statusCode,
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.default = globalErrorHandler;
