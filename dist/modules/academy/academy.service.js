"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const academy_utils_1 = require("./academy.utils");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const prisma_1 = require("../../lib/prisma");
const Pagination_1 = require("../../shared/utils/Pagination");
const getClient_1 = __importDefault(require("../../shared/utils/getClient"));
const omit_1 = require("../../shared/utils/omit");
const AcademyService = {
    async create({ body }) {
        const { name, userId, phone, } = body;
        return prisma_1.prisma.$transaction(async (tx) => {
            const [academyEx, user] = await Promise.all([
                tx.academy.findFirst({
                    where: {
                        OR: [
                            { name },
                            { academyPhones: { some: { phone } } },
                        ],
                    },
                    include: { academyPhones: true },
                }),
                tx.user.findUnique({ where: { id: userId } }),
            ]);
            if (!user)
                throw ApiError_1.default.NotFound("User");
            if (academyEx?.name === name)
                throw ApiError_1.default.Conflict("NAME_ALREADY_EXISTS");
            if (academyEx?.academyPhones.some((p) => p.phone === phone))
                throw ApiError_1.default.Conflict("PHONE_ALREADY_EXISTS");
            const data = {
                name,
                academyPhones: { create: { phone } },
                owners: { connect: { id: userId } },
                wallet: { create: { walletType: "ACADEMY" } },
            };
            return tx.academy.create({ data });
        });
    },
    async update({ body, params }) {
        const { name, image } = body;
        const { academyId } = params;
        return prisma_1.prisma.$transaction(async (tx) => {
            const academy = await tx.academy.findUnique({ where: { id: academyId }, include: { logo: true } });
            if (!academy)
                throw ApiError_1.default.NotFound("Academy");
            if (name && academy.name !== name) {
                const nameExists = await tx.academy.findUnique({ where: { name } });
                if (nameExists)
                    throw ApiError_1.default.Conflict("NAME_ALREADY_EXISTS");
            }
            const data = {};
            if (name && academy.name !== name) {
                data.name = name;
            }
            if (image) {
                if (academy.logoId) {
                    data.logo = {
                        delete: {
                            id: academy.logoId
                        }
                    };
                }
                data.logo = {
                    create: {
                        imageUrl: image.imageUrl,
                        publicId: image.publicId
                    }
                };
            }
            return tx.academy.update({
                where: { id: academyId },
                data,
            });
        });
    },
    async delete({ params }) {
        const { academyId } = params;
        const academyExists = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            select: { id: true }
        });
        if (!academyExists)
            throw ApiError_1.default.NotFound("Academy");
        return await prisma_1.prisma.academy.delete({
            where: { id: academyId },
        });
    },
    async getAll({ query }) {
        const { limit, page, ...filters } = query;
        const where = (0, academy_utils_1.buildAcademyWhere)(filters);
        const { take, skip } = (0, Pagination_1.buildPagination)({ page, limit });
        const [academies, count] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.academy.findMany({ where, take, skip }),
            prisma_1.prisma.academy.count({ where }),
        ]);
        const pagination = (0, Pagination_1.buildPaginationMeta)({ limit, count, page });
        return { items: academies, pagination };
    },
    async getDetails({ params }) {
        const { academyId } = params;
        const academy = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            include: {
                academyPhones: true,
                addresses: true,
                owners: true,
                paymentLinks: true,
                socialMedia: true,
                logo: true,
                wallet: { where: { walletType: "ACADEMY" } }
            }
        });
        if (!academy)
            throw ApiError_1.default.NotFound("Academy");
        const academySafe = {
            ...academy,
            owners: academy.owners.map((u) => (0, omit_1.omit)(u, ["password", "logoutAt"])),
        };
        return academySafe;
    },
    async addAddress({ body, params }) {
        const { address } = body;
        const { academyId } = params;
        const academyExists = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            select: { id: true }
        });
        if (!academyExists)
            throw ApiError_1.default.NotFound("Academy");
        return await prisma_1.prisma.academy.update({
            where: { id: academyId },
            data: { addresses: { create: { address } } },
            include: { addresses: true }
        });
    },
    async deleteAddress({ params }) {
        const { academyId, addressId } = params;
        const academyCheck = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            select: { addresses: { where: { id: addressId }, select: { id: true } } }
        });
        if (!academyCheck)
            throw ApiError_1.default.NotFound("Academy");
        if (academyCheck.addresses.length === 0)
            throw ApiError_1.default.NotFound("AcademyAddress");
        return await prisma_1.prisma.academy.update({
            where: { id: academyId },
            data: { addresses: { delete: { id: addressId } } },
            include: { addresses: true }
        });
    },
    async addPhone({ body, params }) {
        const { phone } = body;
        const { academyId } = params;
        const academyExists = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            select: { id: true }
        });
        if (!academyExists)
            throw ApiError_1.default.NotFound("Academy");
        const phoneExists = await prisma_1.prisma.academyPhone.findUnique({ where: { phone } });
        if (phoneExists)
            throw ApiError_1.default.Conflict("PHONE_ALREADY_EXISTS");
        return await prisma_1.prisma.academy.update({
            where: { id: academyId },
            data: { academyPhones: { create: { phone } } },
            include: { academyPhones: true }
        });
    },
    async deletePhone({ params }) {
        const { academyId, phoneId } = params;
        const academyCheck = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            select: { academyPhones: { where: { id: phoneId }, select: { id: true } } }
        });
        if (!academyCheck)
            throw ApiError_1.default.NotFound("Academy");
        if (academyCheck.academyPhones.length === 0)
            throw ApiError_1.default.NotFound("AcademyPhone");
        return await prisma_1.prisma.academy.update({
            where: { id: academyId },
            data: { academyPhones: { delete: { id: phoneId } } },
            include: { academyPhones: true }
        });
    },
    async addSocialMedia({ body, params }) {
        const { url, platform } = body;
        const { academyId } = params;
        const academyExists = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            select: { id: true }
        });
        if (!academyExists)
            throw ApiError_1.default.NotFound("Academy");
        return await prisma_1.prisma.academy.update({
            where: { id: academyId },
            data: { socialMedia: { create: { url, platform } } },
            include: { socialMedia: true }
        });
    },
    async deleteSocialMedia({ params }) {
        const { academyId, socialMediaId } = params;
        const academyCheck = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            select: { socialMedia: { where: { id: socialMediaId }, select: { id: true } } }
        });
        if (!academyCheck)
            throw ApiError_1.default.NotFound("Academy");
        if (academyCheck.socialMedia.length === 0)
            throw ApiError_1.default.NotFound("SocialMedia");
        return await prisma_1.prisma.academy.update({
            where: { id: academyId },
            data: { socialMedia: { delete: { id: socialMediaId } } },
            include: { socialMedia: true }
        });
    },
    async myAcademics({ userId, tx }) {
        const client = (0, getClient_1.default)(tx);
        return await client.academy.findMany({
            where: { owners: { some: { id: userId } } }
        });
    },
    async addOwner({ params }) {
        const { academyId, userId } = params;
        return await prisma_1.prisma.$transaction(async (tx) => {
            const academy = await tx.academy.findUnique({
                where: { id: academyId },
                include: { owners: true }
            });
            if (!academy)
                throw ApiError_1.default.NotFound("Academy");
            const isOwner = academy.owners.some(o => o.id === userId);
            if (isOwner) {
                return (0, academy_utils_1.sanitizeAcademy)(academy);
            }
            const user = await tx.user.findUnique({ where: { id: userId }, select: { id: true } });
            if (!user)
                throw ApiError_1.default.NotFound("User");
            const updatedAcademy = await tx.academy.update({
                where: { id: academyId },
                data: { owners: { connect: { id: userId } } },
                include: { owners: true }
            });
            return (0, academy_utils_1.sanitizeAcademy)(updatedAcademy);
        });
    },
    async deleteOwner({ params }) {
        const { academyId, userId } = params;
        const academy = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            include: { owners: true }
        });
        if (!academy)
            throw ApiError_1.default.NotFound("Academy");
        const isOwner = academy.owners.some(o => o.id === userId);
        if (!isOwner) {
            return (0, academy_utils_1.sanitizeAcademy)(academy);
        }
        const updatedAcademy = await prisma_1.prisma.academy.update({
            where: { id: academyId },
            data: { owners: { disconnect: { id: userId } } },
            include: { owners: true }
        });
        return (0, academy_utils_1.sanitizeAcademy)(updatedAcademy);
    },
    async addPaymentLink({ params, body }) {
        const { url, walletProvider, phone } = body;
        const { academyId } = params;
        const academyExists = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            select: { id: true }
        });
        if (!academyExists)
            throw ApiError_1.default.NotFound("Academy");
        return await prisma_1.prisma.academy.update({
            where: { id: academyId },
            data: { paymentLinks: { create: { url, walletProvider, phone } } },
            include: { paymentLinks: true }
        });
    },
    async deletePaymentLink({ params }) {
        const { academyId, paymentLinkId } = params;
        const academyCheck = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            select: { paymentLinks: { where: { id: paymentLinkId }, select: { id: true } } }
        });
        if (!academyCheck)
            throw ApiError_1.default.NotFound("Academy");
        if (academyCheck.paymentLinks.length === 0)
            throw ApiError_1.default.NotFound("PaymentLink");
        return await prisma_1.prisma.academy.update({
            where: { id: academyId },
            data: { paymentLinks: { delete: { id: paymentLinkId } } },
            include: { paymentLinks: true }
        });
    },
};
exports.default = AcademyService;
