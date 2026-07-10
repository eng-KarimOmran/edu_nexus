"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const client_service_1 = __importDefault(require("../client/client.service"));
const subscription_service_1 = __importDefault(require("../subscription/subscription.service"));
const walletMovement_service_1 = __importDefault(require("../walletMovement/walletMovement.service"));
const PublicService = {
    async getAcademy({ params }) {
        const { academyId } = params;
        const academy = await prisma_1.prisma.academy.findUnique({
            where: { id: academyId },
            include: {
                academyRules: true,
                academyPhones: true,
                addresses: true,
                socialMedia: true,
                paymentLinks: true,
            },
        });
        if (!academy)
            throw ApiError_1.default.NotFound("Academy");
        return academy;
    },
    async getCourses({ params }) {
        const { academyId } = params;
        return prisma_1.prisma.course.findMany({
            where: {
                academyId,
                isActive: true,
            },
            include: {
                features: true,
            },
            orderBy: { createdAt: "asc" }
        });
    },
    async getAreas() {
        return prisma_1.prisma.area.findMany({
            where: {
                isActive: true,
            },
        });
    },
    async getClient({ params }) {
        const { academyId, clientId } = params;
        const client = await prisma_1.prisma.client.findFirst({
            where: {
                id: clientId,
                academyId,
            },
            include: {
                subscriptions: {
                    include: {
                        walletMovements: true,
                        lessons: {
                            include: {
                                jobProfile: {
                                    select: { user: { select: { id: true, name: true, phone: true } } }
                                }
                            }
                        }
                    }
                },
                academy: {
                    include: {
                        academyRules: true
                    }
                }
            },
        });
        if (!client)
            throw ApiError_1.default.NotFound("Client");
        return client;
    },
    async register({ body, params }) {
        const { academyId } = params;
        const { client, payment, subscription } = body;
        return await prisma_1.prisma.$transaction(async (tx) => {
            const [academy, course, area] = await Promise.all([
                tx.academy.findUnique({ where: { id: academyId } }),
                tx.course.findUnique({ where: { id: subscription.courseId } }),
                tx.area.findUnique({ where: { id: subscription.areaId } }),
            ]);
            if (!academy)
                throw ApiError_1.default.NotFound("Academy");
            if (!course)
                throw ApiError_1.default.NotFound("Course");
            if (!area)
                throw ApiError_1.default.NotFound("Area");
            const newClient = await client_service_1.default.createClient({ params: { academyId }, body: client, tx });
            const sub = await subscription_service_1.default.createSubscription({ tx, data: { params: { academyId }, body: { ...subscription, clientId: newClient.id } } });
            if (payment) {
                await walletMovement_service_1.default.processPaymentTransaction({ tx, body: { ...payment, subscriptionId: sub.id, transactionType: "CUSTOMER_PAYMENT", paymentMethod: "ELECTRONIC" }, params: { academyId } });
            }
            return newClient;
        });
    },
};
exports.default = PublicService;
