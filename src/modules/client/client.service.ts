import { IClientService } from "./client.type";
import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import { buildPagination, buildPaginationMeta } from "../../shared/utils/Pagination";
import { buildClientWhere, orderBy } from "./client.utils";
import { ClientCreateInput, ClientGetPayload } from "@/prisma/generated/models";
import { TransactionClient } from "@/prisma/generated/internal/prismaNamespace";
import SubscriptionService from "../subscription/subscription.service";

const ClientService: IClientService = {
  async createClient({ params, body, tx }) {
    const { academyId } = params;
    const { phone } = body;

    const run = async (tx: TransactionClient) => {
      const phoneExists = await tx.client.findUnique({ where: { phone_academyId: { phone, academyId } } });
      if (phoneExists) {
        throw ApiError.Conflict("PHONE_ALREADY_EXISTS");
      }

      const data: ClientCreateInput = {
        academy: { connect: { id: academyId } },
        wallet: { create: { academyId, walletType: "CLIENT" } },
        ...body
      }
      return await tx.client.create({ data });
    }

    return tx ? run(tx) : prisma.$transaction(run)
  },

  async updateClient({ params, body }) {
    const { clientId, academyId } = params;

    const client = await prisma.client.findUnique({
      where: { id: clientId, academyId },
    });

    if (!client) throw ApiError.NotFound("Client");

    return prisma.client.update({
      where: { id: clientId },
      data: body,
    });
  },

  async deleteClient({ params, tx }) {
    const { clientId, academyId } = params;

    const run = async (tx: TransactionClient) => {
      const client = await tx.client.findUnique({
        where: { id: clientId, academyId },
        include: {
          subscriptions: true
        }
      });

      if (!client) throw ApiError.NotFound("Client");

      await Promise.all(client.subscriptions.map((s) => SubscriptionService.deleteSubscription({ tx, params: { academyId: s.academyId, subscriptionId: s.id } })))

      return tx.client.delete({
        where: { id: clientId },
      });
    }

    return tx ? await run(tx) : await prisma.$transaction(run);
  },

  async getAllClients({ params, query }) {
    const { academyId } = params;
    const { page, limit, ...filters } = query;

    const pagination = buildPagination({ page, limit });

    const where = buildClientWhere({
      academyId,
      ...filters,
    });

    const { clients, count } = await prisma.$transaction(async (tx) => {
      const [clients, count] = await Promise.all([
        tx.client.findMany({
          where,
          ...pagination,
          orderBy,
        }),
        tx.client.count({ where }),
      ]);

      return { clients, count };
    });

    return {
      items: clients,
      pagination: buildPaginationMeta({
        page,
        limit,
        count,
      }),
    };
  },

  async getClientDetails({ params, query }) {
    const { academyId } = params;
    const { phone, clientId } = query

    if (!phone && !clientId) {
      throw ApiError.ValidationError("يجب إرسال رقم الهاتف أو معرف العميل")
    }

    let currentClient: ClientGetPayload<{ include: { subscriptions: true, wallet: true, academy: true } }> | null = null

    if (clientId) {
      const client = await prisma.client.findUnique({
        where: { id: clientId, academyId },
        include: { subscriptions: true, academy: true, wallet: true }
      });
      if (client) {
        currentClient = client
      }
    }

    if (phone && !currentClient) {
      const client = await prisma.client.findFirst({
        where: { academyId, phone },
        include: { subscriptions: true, academy: true, wallet: true }
      });
      if (client) {
        currentClient = client
      }
    }

    if (!currentClient) throw ApiError.NotFound("Client")

    const otherFiles = await prisma.client.findMany({
      where: { phone: currentClient.phone, academyId: { not: currentClient.academyId } },
      include: { academy: true }
    });

    return {
      currentClient,
      otherFiles,
    };
  }
};

export default ClientService;