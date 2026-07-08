"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundRouter = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const notFoundRouter = (_, __) => {
    throw ApiError_1.default.NotFound("PATH_NOT_FOUND");
};
exports.notFoundRouter = notFoundRouter;
