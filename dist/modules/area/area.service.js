"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const Pagination_1 = require("../../shared/utils/Pagination");
const area_utils_1 = require("./area.utils");
const AreaService = {
    async createArea({ body }) {
        const area = await prisma_1.prisma.area.findUnique({ where: { name: body.name } });
        if (area)
            throw ApiError_1.default.Conflict("NAME_ALREADY_EXISTS");
        return prisma_1.prisma.area.create({ data: body });
    },
    async updateArea({ params, body }) {
        const { areaId } = params;
        const area = await prisma_1.prisma.area.findFirst({ where: { id: areaId } });
        if (!area)
            throw ApiError_1.default.NotFound("Area");
        if (body.name && body.name !== area.name) {
            const area = await prisma_1.prisma.area.findUnique({ where: { name: body.name } });
            if (area)
                throw ApiError_1.default.Conflict("NAME_ALREADY_EXISTS");
        }
        return prisma_1.prisma.area.update({
            where: {
                id: areaId,
            },
            data: body,
        });
    },
    async deleteArea({ params }) {
        const { areaId } = params;
        const area = await prisma_1.prisma.area.findUnique({ where: { id: areaId } });
        if (!area)
            throw ApiError_1.default.NotFound("Area");
        return prisma_1.prisma.area.delete({
            where: {
                id: areaId,
            },
        });
    },
    async getAllAreas({ query }) {
        const { page, limit, search, isActive } = query;
        const where = (0, area_utils_1.buildAreaWhere)({
            search,
            isActive,
        });
        const { take, skip } = (0, Pagination_1.buildPagination)({ page, limit });
        const [items, count] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.area.findMany({
                where,
                skip,
                take,
                orderBy: area_utils_1.orderBy,
            }),
            prisma_1.prisma.area.count({
                where,
            }),
        ]);
        return {
            items,
            pagination: (0, Pagination_1.buildPaginationMeta)({
                count,
                page,
                limit,
            }),
        };
    },
    async getAreaDetails({ params }) {
        const { areaId } = params;
        const area = await prisma_1.prisma.area.findUnique({
            where: {
                id: areaId,
            },
        });
        if (!area)
            throw ApiError_1.default.NotFound("Area");
        return area;
    },
};
exports.default = AreaService;
