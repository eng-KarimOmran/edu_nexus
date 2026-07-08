"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const prisma_1 = require("../../lib/prisma");
const allowJobProfiles = (types) => {
    return async (req, _, next) => {
        const academy = req.academy;
        const userLogin = req.userLogin;
        if (!userLogin)
            throw ApiError_1.default.NotFound("User");
        const isOwner = academy ? academy.owners.some((o) => o.id === userLogin.id) : !!await prisma_1.prisma.academy.findFirst({ where: { owners: { some: { id: userLogin.id } } } });
        const jobProfile = await prisma_1.prisma.jobProfile.findUnique({ where: { userId: userLogin.id } });
        if (!isOwner) {
            if (!jobProfile)
                throw ApiError_1.default.NotFound("JobProfile");
            if (!types.includes(jobProfile.jobProfileType)) {
                throw ApiError_1.default.Forbidden();
            }
            if (!jobProfile.isActive) {
                throw ApiError_1.default.AccountBlocked("ملفك الوظيفي موقوف حاليًا");
            }
        }
        req.jobProfile = jobProfile ?? undefined;
        return next();
    };
};
exports.default = allowJobProfiles;
