"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAreaSchema = exports.GetAreaDetailsSchema = exports.GetAllAreasSchema = exports.UpdateAreaSchema = exports.CreateAreaSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.CreateAreaSchema = {
    body: zod_1.default.object({
        name: common_validation_1.entityName,
        supportType: common_validation_1.supportType,
    }),
};
exports.UpdateAreaSchema = {
    params: zod_1.default.object({
        areaId: common_validation_1.id,
    }),
    body: zod_1.default.object({
        name: common_validation_1.entityName.optional(),
        supportType: common_validation_1.supportType.optional(),
        isActive: common_validation_1.boolean.optional(),
    }),
};
exports.GetAllAreasSchema = {
    query: zod_1.default.object({
        page: common_validation_1.page,
        limit: common_validation_1.limit,
        search: zod_1.default.string().optional(),
        isActive: common_validation_1.booleanQuery.optional(),
        supportType: common_validation_1.supportType.optional(),
    }),
};
exports.GetAreaDetailsSchema = {
    params: zod_1.default.object({
        areaId: common_validation_1.id,
    }),
};
exports.DeleteAreaSchema = {
    params: zod_1.default.object({
        areaId: common_validation_1.id,
    }),
};
