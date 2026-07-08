"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = exports.GetClientSchema = exports.GetAreasSchema = exports.GetCoursesSchema = exports.GetAcademySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.GetAcademySchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
    }),
};
exports.GetCoursesSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
    }),
};
exports.GetAreasSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
    }),
};
exports.GetClientSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
        clientId: common_validation_1.id,
    }),
};
exports.RegisterSchema = {
    params: zod_1.default.object({
        academyId: common_validation_1.id,
    }),
    body: zod_1.default.object({
        client: zod_1.default.object({
            name: common_validation_1.personName,
            phone: common_validation_1.phone,
        }),
        subscription: zod_1.default.object({
            courseId: common_validation_1.id,
            areaId: common_validation_1.id,
            trainingTypeAtRegistration: common_validation_1.transmission,
        }),
        payment: zod_1.default.object({
            amount: common_validation_1.price,
            image: zod_1.default.object({
                publicId: zod_1.default.string().min(1, "معرف الصورة مطلوب"),
                imageUrl: common_validation_1.url,
            }),
        }).optional(),
    }),
};
