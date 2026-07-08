"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendSuccess = ({ res, data = null, message = "تمت العملية بنجاح", statusCode = 200, }) => {
    return res.status(statusCode).json({
        success: true,
        message,
        statusCode,
        data,
    });
};
exports.default = sendSuccess;
