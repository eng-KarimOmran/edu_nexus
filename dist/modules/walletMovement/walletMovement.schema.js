"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferFundsSchema = exports.ProcessPaymentTransactionSchema = exports.ChangeWalletMovementStatusSchema = exports.GetWalletMovementDetailsSchema = exports.GetAllWalletMovement = void 0;
const z = __importStar(require("zod"));
const common_validation_1 = require("../../shared/utils/common.validation");
exports.GetAllWalletMovement = {
    params: z.object({
        academyId: common_validation_1.id,
    }),
    query: z.object({
        page: common_validation_1.page,
        limit: common_validation_1.limit,
        search: z.string().optional(),
        transactionType: common_validation_1.transactionType.optional(),
        paymentMethod: common_validation_1.paymentMethod.optional(),
    }),
};
exports.GetWalletMovementDetailsSchema = {
    params: z.object({
        academyId: common_validation_1.id,
        walletMovementId: common_validation_1.id,
    }),
};
exports.ChangeWalletMovementStatusSchema = {
    params: z.object({
        academyId: common_validation_1.id,
        walletMovementId: common_validation_1.id,
    }),
    body: z.object({
        walletMovementStatus: common_validation_1.walletMovementStatus,
    }),
};
exports.ProcessPaymentTransactionSchema = {
    params: z.object({
        academyId: common_validation_1.id,
    }),
    body: z.object({
        subscriptionId: common_validation_1.id,
        transactionType: common_validation_1.transactionType.extract(["CUSTOMER_PAYMENT", "CUSTOMER_REFUND"]),
        paymentMethod: common_validation_1.paymentMethod,
        lessonId: common_validation_1.id.optional(),
        amount: common_validation_1.price.min(1, "يجب أن يكون مبلغ الدفع أكبر من صفر"),
        image: z.object({
            publicId: z.string().min(1, "معرف الصورة مطلوب"),
            imageUrl: common_validation_1.url,
        }).optional(),
    }).refine((data) => {
        const isElectronic = data.paymentMethod === "ELECTRONIC";
        return !isElectronic || !!data.image;
    }, {
        error: "الصورة مطلوبة عند الدفع الإلكتروني",
        path: ["image"],
        abort: true,
    })
};
exports.TransferFundsSchema = {
    params: z.object({
        academyId: common_validation_1.id,
    }),
    body: z.object({
        receiverWalletId: common_validation_1.id,
        transactionType: common_validation_1.transactionType.extract([
            "ACADEMY_TRANSFER_TO_EMPLOYEE",
            "EMPLOYEE_TRANSFER_TO_ACADEMY",
            "EMPLOYEE_TRANSFER_TO_EMPLOYEE"
        ]),
        amount: common_validation_1.price.min(1, "يجب أن يكون مبلغ الدفع أكبر من صفر"),
    }),
};
