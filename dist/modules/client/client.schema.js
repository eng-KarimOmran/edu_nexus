"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetClientDetailsSchema = exports.GetAllClientsSchema = exports.DeleteClientSchema = exports.UpdateClientSchema = exports.CreateClientSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.CreateClientSchema = {
    params: zod_1.default.object({ academyId: common_validation_1.id }),
    body: zod_1.default.object({
        name: common_validation_1.personName,
        phone: common_validation_1.phone,
        source: common_validation_1.clientSource.optional(),
    }),
};
exports.UpdateClientSchema = {
    params: zod_1.default.object({ clientId: common_validation_1.id, academyId: common_validation_1.id }),
    body: zod_1.default.object({
        name: common_validation_1.personName.optional(),
        phone: common_validation_1.phone.optional(),
        source: common_validation_1.clientSource.optional(),
    }),
};
exports.DeleteClientSchema = {
    params: zod_1.default.object({ clientId: common_validation_1.id, academyId: common_validation_1.id }),
};
exports.GetAllClientsSchema = {
    params: zod_1.default.object({ academyId: common_validation_1.id }),
    query: zod_1.default.object({
        page: common_validation_1.page,
        limit: common_validation_1.limit,
        search: zod_1.default.string().optional(),
        source: common_validation_1.clientSource.optional(),
    }),
};
exports.GetClientDetailsSchema = {
    params: zod_1.default.object({ academyId: common_validation_1.id }),
    query: zod_1.default.object({
        phone: common_validation_1.phone.optional(),
        clientId: common_validation_1.id.optional()
    })
};
