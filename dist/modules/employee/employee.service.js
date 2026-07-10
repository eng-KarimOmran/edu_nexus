"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const employee_select_1 = require("./employee.select");
const EmployeeService = {
    async getJobProfileDebts({ jobProfileId }) {
        return await prisma_1.prisma.wallet.findMany({ where: { jobProfileId }, include: { academy: true } });
    },
    async getAllLessons({ query }) {
        const { startTime, endTime, lessonStatus, jobProfileId } = query;
        const where = {
            startTime: { gte: startTime },
            endTime: { lte: endTime },
            ...(jobProfileId && { jobProfileId: jobProfileId }),
            ...(lessonStatus && { lessonStatus: lessonStatus }),
        };
        const select = {
            id: true,
            startTime: true,
            endTime: true,
            lessonStatus: true,
            subscriptionId: true,
            expectedPaymentAmount: true,
            car: { select: { id: true, modelName: true, plateNumber: true } },
            area: { select: { id: true, name: true } },
            client: { select: { id: true, name: true, phone: true } },
            academy: { select: { id: true, name: true } },
            jobProfile: { select: { id: true, user: { select: { id: true, name: true, phone: true } } } }
        };
        const lessons = await prisma_1.prisma.lesson.findMany({ where, select, orderBy: { startTime: "asc" } });
        return lessons;
    },
    async getClient({ query }) {
        const { search } = query;
        let client = null;
        const isPhone = /^01[0125]\d{8}$/.test(search);
        if (isPhone) {
            client = await prisma_1.prisma.client.findFirst({ where: { phone: search } });
        }
        else {
            client = await prisma_1.prisma.client.findUnique({ where: { id: search } });
        }
        if (!client)
            throw ApiError_1.default.NotFound("Client");
        return client;
    },
    async getEmployeesWithDebts() {
        return await prisma_1.prisma.jobProfile.findMany({
            select: employee_select_1.jobProfileSelect
        });
    },
};
exports.default = EmployeeService;
