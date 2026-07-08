"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAcademyExists = void 0;
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const prisma_1 = require("../../lib/prisma");
const checkAcademyExists = ({ isAcademyOwner } = {}) => {
    return async (req, _, next) => {
        const userId = req.userLogin?.id;
        if (!userId)
            throw ApiError_1.default.Unauthorized();
        const academyId = req.params?.academyId;
        if (!academyId || typeof academyId !== "string") {
            throw ApiError_1.default.ValidationError("معرف الأكاديمية مطلوب");
        }
        const academy = req.academy ?? await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            include: {
                owners: true,
                wallet: true
            }
        });
        if (!academy)
            throw ApiError_1.default.NotFound("Academy");
        const isOwner = academy.owners.some((o) => o.id === userId);
        if (isAcademyOwner) {
            if (!isOwner)
                throw ApiError_1.default.Forbidden();
        }
        if (!academy.wallet) {
            throw ApiError_1.default.NotFound("wallet");
        }
        req.academy = academy;
        req.isOwner = isOwner;
        return next();
    };
};
exports.checkAcademyExists = checkAcademyExists;
