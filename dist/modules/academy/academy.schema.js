"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.AcademySchema = {
    create: {
        body: zod_1.default.object({
            name: common_validation_1.entityName,
            profileTrackingUrl: common_validation_1.url.optional(),
            phone: common_validation_1.phone,
            userId: common_validation_1.id,
        }),
    },
    update: {
        params: zod_1.default.object({
            academyId: common_validation_1.id,
        }),
        body: zod_1.default.object({
            name: common_validation_1.entityName.optional(),
            profileTrackingUrl: common_validation_1.url.optional()
        }),
    },
    delete: {
        params: zod_1.default.object({
            academyId: common_validation_1.id,
        }),
    },
    get: {
        params: zod_1.default.object({
            academyId: common_validation_1.id,
        }),
    },
    getAll: {
        query: zod_1.default.object({
            page: common_validation_1.page,
            limit: common_validation_1.limit,
            search: zod_1.default.string().optional(),
        }),
    },
    phone: {
        add: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
            }),
            body: zod_1.default.object({
                phone: common_validation_1.phone,
            }),
        },
        delete: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
                phoneId: common_validation_1.id,
            }),
        },
    },
    address: {
        add: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
            }),
            body: zod_1.default.object({
                address: common_validation_1.address,
            }),
        },
        delete: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
                addressId: common_validation_1.id,
            }),
        },
    },
    socialMedia: {
        add: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
            }),
            body: zod_1.default.object({
                platform: common_validation_1.platform,
                url: common_validation_1.url,
            }),
        },
        delete: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
                socialMediaId: common_validation_1.id,
            }),
        }
    },
    owner: {
        add: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
                userId: common_validation_1.id,
            }),
        },
        delete: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
                userId: common_validation_1.id,
            }),
        },
    },
    paymentLink: {
        add: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
            }),
            body: zod_1.default.object({
                url: common_validation_1.url,
                walletProvider: zod_1.default.string(),
                phone: common_validation_1.phone.optional()
            }),
        },
        delete: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
                paymentLinkId: common_validation_1.id,
            }),
        }
    },
    rule: {
        add: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
            }),
            body: zod_1.default.object({
                content: zod_1.default.string().trim().min(1).max(5000),
            }),
        },
        delete: {
            params: zod_1.default.object({
                academyId: common_validation_1.id,
                ruleId: common_validation_1.id,
            }),
        },
    },
};
