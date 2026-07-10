import { IPublicService } from "./public.type";
import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import ClientService from "../client/client.service";
import SubscriptionService from "../subscription/subscription.service";
import WalletMovementService from "../walletMovement/walletMovement.service";

const PublicService: IPublicService = {
    async getAcademy({ params }) {
        const { academyId } = params;

        const academy = await prisma.academy.findUnique({
            where: { id: academyId },
            include: {
                academyRules: true,
                academyPhones: true,
                addresses: true,
                socialMedia: true,
                paymentLinks: true,
            },
        });

        if (!academy) throw ApiError.NotFound("Academy");

        return academy;
    },

    async getCourses({ params }) {
        const { academyId } = params;

        return prisma.course.findMany({
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
        return prisma.area.findMany({
            where: {
                isActive: true,
            },
        });
    },

    async getClient({ params }) {
        const { academyId, clientId } = params;

        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                academyId,
            },
            include: {
                subscriptions: {
                    include: {
                        walletMovements: true
                    }
                },
                academy: {
                    include: {
                        academyRules: true
                    }
                }
            },
        });

        if (!client) throw ApiError.NotFound("Client");

        return client;
    },

    async register({ body, params }) {
        const { academyId } = params
        const { client, payment, subscription } = body
        return await prisma.$transaction(async (tx) => {

            const [academy, course, area] = await Promise.all([
                tx.academy.findUnique({ where: { id: academyId } }),
                tx.course.findUnique({ where: { id: subscription.courseId } }),
                tx.area.findUnique({ where: { id: subscription.areaId } }),
            ])

            if (!academy) throw ApiError.NotFound("Academy")
            if (!course) throw ApiError.NotFound("Course")
            if (!area) throw ApiError.NotFound("Area")

            const newClient = await ClientService.createClient({ params: { academyId }, body: client, tx })

            const sub = await SubscriptionService.createSubscription({ tx, data: { params: { academyId }, body: { ...subscription, clientId: newClient.id } } })

            if (payment) {
                await WalletMovementService.processPaymentTransaction({ tx, body: { ...payment, subscriptionId: sub.id, transactionType: "CUSTOMER_PAYMENT", paymentMethod: "ELECTRONIC" }, params: { academyId } })
            }

            return newClient
        })
    },
};

export default PublicService;