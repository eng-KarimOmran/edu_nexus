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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Schema = __importStar(require("./walletMovement.schema"));
const validate_middleware_1 = __importDefault(require("../../shared/middlewares/validate.middleware"));
const academy_middleware_1 = require("../academy/academy.middleware");
const jobProfile_middlewares_1 = __importDefault(require("../jobProfile/jobProfile.middlewares"));
const walletMovement_controller_1 = __importDefault(require("./walletMovement.controller"));
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", (0, validate_middleware_1.default)(Schema.ProcessPaymentTransactionSchema), (0, jobProfile_middlewares_1.default)(["MANAGER", "SECRETARY"]), walletMovement_controller_1.default.processPaymentTransaction);
router.post("/transfer-funds", (0, validate_middleware_1.default)(Schema.TransferFundsSchema), (0, jobProfile_middlewares_1.default)(["MANAGER", "SECRETARY"]), walletMovement_controller_1.default.transferFunds);
router.get("/", (0, validate_middleware_1.default)(Schema.GetAllWalletMovement), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), walletMovement_controller_1.default.getAllWalletMovements);
router.patch("/:walletMovementId/change-status", (0, validate_middleware_1.default)(Schema.ChangeWalletMovementStatusSchema), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), walletMovement_controller_1.default.changeWalletMovementStatus);
router.get("/:walletMovementId", (0, validate_middleware_1.default)(Schema.GetWalletMovementDetailsSchema), (0, jobProfile_middlewares_1.default)(["MANAGER", "SECRETARY"]), walletMovement_controller_1.default.getWalletMovementDetails);
exports.default = router;
