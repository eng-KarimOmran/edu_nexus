"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCarSchema = exports.GetCarDetailsSchema = exports.GetAllCarsSchema = exports.UpdateCarSchema = exports.CreateCarSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.CreateCarSchema = {
    body: zod_1.default.object({
        plateNumber: common_validation_1.entityName,
        modelName: common_validation_1.entityName,
        gearType: common_validation_1.transmission,
        carSessionPrice: common_validation_1.price,
    }),
};
exports.UpdateCarSchema = {
    params: zod_1.default.object({ carId: common_validation_1.id }),
    body: zod_1.default.object({
        plateNumber: common_validation_1.entityName.optional(),
        modelName: common_validation_1.entityName.optional(),
        gearType: common_validation_1.transmission.optional(),
        carSessionPrice: common_validation_1.price.optional(),
        isActive: common_validation_1.boolean.optional(),
    }),
};
exports.GetAllCarsSchema = {
    query: zod_1.default.object({
        page: common_validation_1.page,
        limit: common_validation_1.limit,
        search: zod_1.default.string().optional(),
        isActive: common_validation_1.booleanQuery.optional(),
        gearType: common_validation_1.transmission.optional(),
    }),
};
exports.GetCarDetailsSchema = {
    params: zod_1.default.object({ carId: common_validation_1.id }),
};
exports.DeleteCarSchema = {
    params: zod_1.default.object({ carId: common_validation_1.id }),
};
