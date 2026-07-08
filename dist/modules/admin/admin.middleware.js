"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const isAdmin = (req, _, next) => {
    const isAdmin = req.userLogin?.isAdmin;
    if (!isAdmin)
        throw ApiError_1.default.Forbidden();
    return next();
};
exports.isAdmin = isAdmin;
