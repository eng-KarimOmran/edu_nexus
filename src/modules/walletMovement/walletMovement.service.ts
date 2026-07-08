import { WalletUpdateInput } from '@/prisma/generated/models/Wallet';
import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import { buildPagination, buildPaginationMeta } from '../../shared/utils/Pagination';
import { PrismaPromise, TransactionClient, WalletMovementCreateInput } from '@/prisma/generated/internal/prismaNamespace';
import SubscriptionService from '../subscription/subscription.service';
import { buildWalletMovementWhere, getAndValidateSubscription, getOrCreateInternalWallet, orderBy } from './walletMovement.utils';
import { IWalletMovementService } from "./walletMovement.type";
import { PaymentMethod } from '@/prisma/generated/client';

const WalletMovementService: IWalletMovementService = {
  async getAllWalletMovements({ params, query }) {
    const { academyId } = params;

    const {
      page,
      limit,
      search,
      paymentMethod,
      transactionType,
    } = query;

    const where = buildWalletMovementWhere({
      academyId,
      search,
      paymentMethod,
      transactionType,
    });

    const { take, skip } = buildPagination({
      page,
      limit,
    });

    const [items, count] = await prisma.$transaction([
      prisma.walletMovement.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          paymentProofImage: true,
        },
      }),

      prisma.walletMovement.count({
        where,
      }),
    ]);

    return {
      items,
      pagination: buildPaginationMeta({
        count,
        page,
        limit,
      }),
    };
  },

  async getWalletMovementDetails({ params }) {
    const { academyId, walletMovementId } = params;

    const WalletMovement = await prisma.walletMovement.findFirst({
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
      throw ApiError.NotFound("walletMovement");
    }

    return WalletMovement;
  },

  async changeWalletMovementStatus({ params, body }) {
    const { walletMovementId } = params;
    const { walletMovementStatus } = body;

    return await prisma.$transaction(async (tx) => {

      const walletMovement = await tx.walletMovement.findUnique({
        where: { id: walletMovementId },
        include: {
          sender: true,
          receiver: true
        }
      });

      if (!walletMovement) throw ApiError.NotFound("walletMovement");

      if (walletMovement.walletMovementStatus === walletMovementStatus) return walletMovement;

      const amount = Number(walletMovement.amount);

      const currentStatus = walletMovement.walletMovementStatus;

      const operations: PrismaPromise<unknown>[] = []

      if (currentStatus === "APPROVED") {
        operations.push(tx.wallet.update({
          where: { id: walletMovement.sender.id },
          data: { balance: { increment: amount } },
        }))

        operations.push(tx.wallet.update({
          where: { id: walletMovement.receiver.id },
          data: { balance: { decrement: amount } },
        }))
      }

      if (walletMovementStatus === "APPROVED") {
        operations.push(tx.wallet.update({
          where: { id: walletMovement.sender.id },
          data: { balance: { decrement: amount } },
        }))

        operations.push(tx.wallet.update({
          where: { id: walletMovement.receiver.id },
          data: { balance: { increment: amount } },
        }))
      }

      await Promise.all(operations)

      const updated = await tx.walletMovement.update({
        where: { id: walletMovementId },
        data: { walletMovementStatus },
      })

      if (walletMovement.subscriptionId) {
        await SubscriptionService.recalculateSubscriptionStatus({ subscriptionId: walletMovement.subscriptionId, tx })
      }

      return updated;
    });
  },

  async processPaymentTransaction({ params, body, tx, isOwner, jobProfileId }) {
    const { academyId } = params;

    const { amount, paymentMethod, subscriptionId, transactionType, image, lessonId } = body;

    const run = async (tx: TransactionClient) => {

      const internalWallet = await getOrCreateInternalWallet({ academyId, isOwner, paymentMethod, jobProfileId, tx })

      const subscription = await getAndValidateSubscription({ subscriptionId, amount, transactionType, tx })

      const isPaymentFromCustomer = transactionType === "CUSTOMER_PAYMENT"

      const senderWalletId = isPaymentFromCustomer ? internalWallet.id : subscription.walletClientId
      const receiverWalletId = isPaymentFromCustomer ? subscription.walletClientId : internalWallet.id

      const walletMovementData: WalletMovementCreateInput = {
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
        if (imageExists) throw ApiError.Conflict("IMAGE_ALREADY_EXISTS");
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

      await SubscriptionService.recalculateSubscriptionStatus({ subscriptionId, tx })

      return newWalletMovement;
    };

    return tx ? await run(tx) : await prisma.$transaction(run);
  },

  async transferFunds({ body, params, isOwner, jobProfileId }) {
    const { academyId } = params
    const { amount, receiverWalletId, transactionType } = body
    return await prisma.$transaction(async (tx) => {
      const paymentMethod: PaymentMethod = "TRANSFER"

      const sender = await getOrCreateInternalWallet({ academyId, isOwner, paymentMethod, jobProfileId, tx })

      const receiver = await tx.wallet.findUnique({ where: { id: receiverWalletId } })

      if (!sender) throw ApiError.NotFound("Sender")
      if (!receiver) throw ApiError.NotFound("Receiver")

      if (sender.id === receiver.id) throw ApiError.Conflict("SENDER_EQ_RECEIVER")

      const data: WalletMovementCreateInput = {
        amount,
        transactionType,
        walletMovementStatus: "APPROVED",
        receiver: { connect: { id: receiver.id } },
        sender: { connect: { id: sender.id } },
        academy: { connect: { id: academyId } },
      }

      const updateSender: WalletUpdateInput = {
        balance: { decrement: amount }
      }

      const updateReceiver: WalletUpdateInput = {
        balance: { increment: amount }
      }

      const [walletMovement] = await Promise.all([
        tx.walletMovement.create({ data }),
        tx.wallet.update({ where: { id: receiver.id }, data: updateReceiver }),
        tx.wallet.update({ where: { id: sender.id }, data: updateSender }),
      ])

      return walletMovement
    })
  },
};

export default WalletMovementService;