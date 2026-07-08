"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const Pagination_1 = require("../../shared/utils/Pagination");
const client_utils_1 = require("./client.utils");
const ClientService = {
    async createClient({ params, body, tx }) {
        const { academyId } = params;
        const { phone } = body;
        const run = async (tx) => {
            const phoneExists = await tx.client.findUnique({ where: { phone_academyId: { phone, academyId } } });
            if (phoneExists) {
                throw ApiError_1.default.Conflict("PHONE_ALREADY_EXISTS");
            }
            const data = {
                academy: { connect: { id: academyId } },
                wallet: { create: { academyId, walletType: "CLIENT" } },
                ...body
            };
            return await tx.client.create({ data });
        };
        return tx ? run(tx) : prisma_1.prisma.$transaction(run);
    },
    async updateClient({ params, body }) {
        const { clientId, academyId } = params;
        const client = await prisma_1.prisma.client.findUnique({
            where: { id: clientId, academyId },
        });
        if (!client)
            throw ApiError_1.default.NotFound("Client");
        return prisma_1.prisma.client.update({
            where: { id: clientId },
            data: body,
        });
    },
    async deleteClient({ params }) {
        const { clientId, academyId } = params;
        const client = await prisma_1.prisma.client.findUnique({
            where: { id: clientId, academyId },
        });
        if (!client)
            throw ApiError_1.default.NotFound("Client");
        return prisma_1.prisma.client.delete({
            where: { id: clientId },
        });
    },
    async getAllClients({ params, query }) {
        const { academyId } = params;
        const { page, limit, ...filters } = query;
        const pagination = (0, Pagination_1.buildPagination)({ page, limit });
        const where = (0, client_utils_1.buildClientWhere)({
            academyId,
            ...filters,
        });
        const { clients, count } = await prisma_1.prisma.$transaction(async (tx) => {
            const [clients, count] = await Promise.all([
                tx.client.findMany({
                    where,
                    ...pagination,
                    orderBy: client_utils_1.orderBy,
                }),
                tx.client.count({ where }),
            ]);
            return { clients, count };
        });
        return {
            items: clients,
            pagination: (0, Pagination_1.buildPaginationMeta)({
                page,
                limit,
                count,
            }),
        };
    },
    async getClientDetails({ params, query }) {
        const { academyId } = params;
        const { phone, clientId } = query;
        if (!phone && !clientId) {
            throw ApiError_1.default.ValidationError("يجب إرسال رقم الهاتف أو معرف العميل");
        }
        let currentClient = null;
        if (clientId) {
            const client = await prisma_1.prisma.client.findUnique({
                where: { id: clientId, academyId },
                include: { subscriptions: true, academy: true, wallet: true }
            });
            if (client) {
                currentClient = client;
            }
        }
        if (phone && !currentClient) {
            const client = await prisma_1.prisma.client.findFirst({
                where: { academyId, phone },
                include: { subscriptions: true, academy: true, wallet: true }
            });
            if (client) {
                currentClient = client;
            }
        }
        if (!currentClient)
            throw ApiError_1.default.NotFound("Client");
        const otherFiles = await prisma_1.prisma.client.findMany({
            where: { phone: currentClient.phone, academyId: { not: currentClient.academyId } },
            include: { academy: true }
        });
        return {
            currentClient,
            otherFiles,
        };
    }
};
exports.default = ClientService;
