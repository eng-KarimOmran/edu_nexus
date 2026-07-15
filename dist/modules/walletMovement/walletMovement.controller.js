"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const walletMovement_service_1 = __importDefault(require("./walletMovement.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const LedgerTransactionController = {
    processPaymentTransaction: async (req, res) => {
        const dataSafe = req.dataSafe;
        const { body, params } = dataSafe;
        const isOwner = req.isOwner;
        const jobProfileId = req.jobProfile?.id;
        const ledgerTransaction = await walletMovement_service_1.default.processPaymentTransaction({ body, params, isOwner, jobProfileId });
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: ledgerTransaction,
            message: "تم إنشاء الحركة المالية بنجاح",
        });
    },
    getAllWalletMovements: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await walletMovement_service_1.default.getAllWalletMovements(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
        });
    },
    getWalletMovementDetails: async (req, res) => {
        const dataSafe = req.dataSafe;
        const ledgerTransaction = await walletMovement_service_1.default.getWalletMovementDetails(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: ledgerTransaction,
        });
    },
    changeWalletMovementStatus: async (req, res) => {
        const dataSafe = req.dataSafe;
        const ledgerTransaction = await walletMovement_service_1.default.changeWalletMovementStatus(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: ledgerTransaction,
        });
    },
    transferFunds: async (req, res) => {
        const dataSafe = req.dataSafe;
        const jobProfileId = req.jobProfile?.id;
        const isOwner = req.isOwner;
        const ledgerTransaction = await walletMovement_service_1.default.transferFunds({ ...dataSafe, jobProfileId, isOwner });
        return (0, successResponse_1.default)({
            res,
            data: ledgerTransaction,
        });
    },
    deleteWalletMovement: async (req, res) => {
        const dataSafe = req.dataSafe;
        const ledgerTransaction = await walletMovement_service_1.default.deleteWalletMovement(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: ledgerTransaction,
        });
    }
};
exports.default = LedgerTransactionController;
