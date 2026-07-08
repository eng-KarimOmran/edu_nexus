"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const Pagination_1 = require("../../shared/utils/Pagination");
const cat_utils_1 = require("./cat.utils");
const CarService = {
    async createCar({ body }) {
        const car = await prisma_1.prisma.car.findUnique({
            where: { plateNumber: body.plateNumber },
        });
        if (car)
            throw ApiError_1.default.Conflict("PLATE_NUMBER_ALREADY_EXISTS");
        return prisma_1.prisma.car.create({ data: body });
    },
    async updateCar({ params, body }) {
        const { carId } = params;
        const car = await prisma_1.prisma.car.findUnique({ where: { id: carId } });
        if (!car)
            throw ApiError_1.default.NotFound("Car");
        if (body.plateNumber && body.plateNumber !== car.plateNumber) {
            const car = await prisma_1.prisma.car.findUnique({
                where: { plateNumber: body.plateNumber },
            });
            if (car)
                throw ApiError_1.default.Conflict("PLATE_NUMBER_ALREADY_EXISTS");
        }
        return prisma_1.prisma.car.update({
            where: { id: carId },
            data: body,
        });
    },
    async deleteCar({ params }) {
        const { carId } = params;
        const car = await prisma_1.prisma.car.findUnique({ where: { id: carId } });
        if (!car)
            throw ApiError_1.default.NotFound("Car");
        return prisma_1.prisma.car.delete({
            where: {
                id: carId,
            },
        });
    },
    async getAllCars({ query }) {
        const { page, limit, search, gearType, isActive } = query;
        const where = (0, cat_utils_1.buildCarWhere)({
            search,
            gearType,
            isActive,
        });
        const { take, skip } = (0, Pagination_1.buildPagination)({ page, limit });
        const [items, count] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.car.findMany({
                where,
                skip,
                take,
                orderBy: cat_utils_1.orderBy,
            }),
            prisma_1.prisma.car.count({ where }),
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
    async getDetails({ params }) {
        const { carId } = params;
        const car = await prisma_1.prisma.car.findUnique({ where: { id: carId } });
        if (!car)
            throw ApiError_1.default.NotFound("Car");
        return car;
    },
};
exports.default = CarService;
