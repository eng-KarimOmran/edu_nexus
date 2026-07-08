"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const Pagination_1 = require("../../shared/utils/Pagination");
const subscription_service_1 = __importDefault(require("../subscription/subscription.service"));
const walletMovement_utils_1 = require("./walletMovement.utils");
const WalletMovementService = {
    async getAllWalletMovements({ params, query }) {
        const { academyId } = params;
        const { page, limit, search, paymentMethod, transactionType, } = query;
        const where = (0, walletMovement_utils_1.buildWalletMovementWhere)({
            academyId,
            search,
            paymentMethod,
            transactionType,
        });
        const { take, skip } = (0, Pagination_1.buildPagination)({
            page,
            limit,
        });
        const [items, count] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.walletMovement.findMany({
                where,
                skip,
                take,
                orderBy: walletMovement_utils_1.orderBy,
                include: {
                    paymentProofImage: true,
                },
            }),
            prisma_1.prisma.walletMovement.count({
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
    async getWalletMovementDetails({ params }) {
        const { academyId, walletMovementId } = params;
        const WalletMovement = await prisma_1.prisma.walletMovement.findFirst({
            where: {
                id: walletMovementId,
                academyId,
            },
            include: {
                sender: { select: { academy: { select: { id: true, name: true } }, jobProfile: { select: { id: true, user: { select: { id: true, name: true, phone: true } } } }, subscription: { select: { id: true, client: { select: { id: true, name: true, phone: true } } } } } },
                receiver: { select: { academy: { select: { id: true, name: true } }, jobProfile: { select: { id: true, user: { select: { id: true, name: true, phone: true } } } }, subscription: { select: { id: true, client: { select: { id: true, name: true, phone: true } } } } } },
                lessons: true,
                image: true,
                academy: true,
            },
        });
        if (!WalletMovement) {
            throw ApiError_1.default.NotFound("walletMovement");
        }
        return WalletMovement;
    },
    async changeWalletMovementStatus({ params, body }) {
        const { walletMovementId } = params;
        const { walletMovementStatus } = body;
        return await prisma_1.prisma.$transaction(async (tx) => {
            const walletMovement = await tx.walletMovement.findUnique({
                where: { id: walletMovementId },
                include: {
                    sender: true,
                    receiver: true
                }
            });
            if (!walletMovement)
                throw ApiError_1.default.NotFound("walletMovement");
            if (walletMovement.walletMovementStatus === walletMovementStatus)
                return walletMovement;
            const amount = Number(walletMovement.amount);
            const currentStatus = walletMovement.walletMovementStatus;
            const operations = [];
            if (currentStatus === "APPROVED") {
                operations.push(tx.wallet.update({
                    where: { id: walletMovement.sender.id },
                    data: { balance: { increment: amount } },
                }));
                operations.push(tx.wallet.update({
                    where: { id: walletMovement.receiver.id },
                    data: { balance: { decrement: amount } },
                }));
            }
            if (walletMovementStatus === "APPROVED") {
                operations.push(tx.wallet.update({
                    where: { id: walletMovement.sender.id },
                    data: { balance: { decrement: amount } },
                }));
                operations.push(tx.wallet.update({
                    where: { id: walletMovement.receiver.id },
                    data: { balance: { increment: amount } },
                }));
            }
            await Promise.all(operations);
            const updated = await tx.walletMovement.update({
                where: { id: walletMovementId },
                data: { walletMovementStatus },
            });
            if (walletMovement.subscriptionId) {
                await subscription_service_1.default.recalculateSubscriptionStatus({ subscriptionId: walletMovement.subscriptionId, tx });
            }
            return updated;
        });
    },
    async processPaymentTransaction({ params, body, tx, isOwner, jobProfileId }) {
        const { academyId } = params;
        const { amount, paymentMethod, subscriptionId, transactionType, image, lessonId } = body;
        const run = async (tx) => {
            const internalWallet = await (0, walletMovement_utils_1.getOrCreateInternalWallet)({ academyId, isOwner, paymentMethod, jobProfileId, tx });
            const subscription = await (0, walletMovement_utils_1.getAndValidateSubscription)({ subscriptionId, amount, transactionType, tx });
            const isPaymentFromCustomer = transactionType === "CUSTOMER_PAYMENT";
            const senderWalletId = isPaymentFromCustomer ? internalWallet.id : subscription.walletClientId;
            const receiverWalletId = isPaymentFromCustomer ? subscription.walletClientId : internalWallet.id;
            const walletMovementData = {
                amount,
                paymentMethod,
                transactionType,
                walletMovementStatus: "APPROVED",
                receiver: { connect: { id: receiverWalletId } },
                sender: { connect: { id: senderWalletId } },
                academy: { connect: { id: academyId } },
                subscription: { connect: { id: subscriptionId } },
                ...(lessonId && { lessons: { connect: { id: lessonId } } })
            };
            if (image) {
                const imageExists = await tx.image.findUnique({ where: { publicId: image.publicId } });
                if (imageExists)
                    throw ApiError_1.default.Conflict("IMAGE_ALREADY_EXISTS");
                walletMovementData.paymentProofImage = {
                    create: { imageUrl: image.imageUrl, publicId: image.publicId }
                };
            }
            const [newWalletMovement] = await Promise.all([
                tx.walletMovement.create({ data: walletMovementData }),
                tx.wallet.update({
                    where: { id: senderWalletId },
                    data: { balance: { decrement: amount } }
                }),
                tx.wallet.update({
                    where: { id: receiverWalletId },
                    data: { balance: { increment: amount } }
                }),
            ]);
            await subscription_service_1.default.recalculateSubscriptionStatus({ subscriptionId, tx });
            return newWalletMovement;
        };
        return tx ? await run(tx) : await prisma_1.prisma.$transaction(run);
    },
    async transferFunds({ body, params, isOwner, jobProfileId }) {
        const { academyId } = params;
        const { amount, receiverWalletId, transactionType } = body;
        return await prisma_1.prisma.$transaction(async (tx) => {
            const paymentMethod = "TRANSFER";
            const sender = await (0, walletMovement_utils_1.getOrCreateInternalWallet)({ academyId, isOwner, paymentMethod, jobProfileId, tx });
            const receiver = await tx.wallet.findUnique({ where: { id: receiverWalletId } });
            if (!sender)
                throw ApiError_1.default.NotFound("Sender");
            if (!receiver)
                throw ApiError_1.default.NotFound("Receiver");
            if (sender.id === receiver.id)
                throw ApiError_1.default.Conflict("SENDER_EQ_RECEIVER");
            const data = {
                amount,
                transactionType,
                walletMovementStatus: "APPROVED",
                receiver: { connect: { id: receiver.id } },
                sender: { connect: { id: sender.id } },
                academy: { connect: { id: academyId } },
            };
            const updateSender = {
                balance: { decrement: amount }
            };
            const updateReceiver = {
                balance: { increment: amount }
            };
            const [walletMovement] = await Promise.all([
                tx.walletMovement.create({ data }),
                tx.wallet.update({ where: { id: receiver.id }, data: updateReceiver }),
                tx.wallet.update({ where: { id: sender.id }, data: updateSender }),
            ]);
            return walletMovement;
        });
    },
};
exports.default = WalletMovementService;
