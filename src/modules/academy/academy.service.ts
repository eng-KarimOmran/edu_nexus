import { buildAcademyWhere, sanitizeAcademy } from "./academy.utils";

import {
  AcademyCreateInput,
  AcademyUpdateInput,
} from "@/prisma/generated/internal/prismaNamespace";

import ApiError from "../../shared/utils/ApiError";
import { prisma } from "../../lib/prisma";
import { IAcademyService } from "./academy.type";

import {
  buildPagination,
  buildPaginationMeta,
} from "../../shared/utils/Pagination";
import getClient from "../../shared/utils/getClient";
import { omit } from "../../shared/utils/omit";

const AcademyService: IAcademyService = {
  async create({ body }) {
    const { name, userId, phone, profileTrackingUrl } = body;

    return prisma.$transaction(async (tx) => {
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

      if (!user) throw ApiError.NotFound("User");
      if (academyEx?.name === name) throw ApiError.Conflict("NAME_ALREADY_EXISTS");
      if (academyEx?.academyPhones.some((p) => p.phone === phone)) throw ApiError.Conflict("PHONE_ALREADY_EXISTS");

      const data: AcademyCreateInput = {
        name,
        profileTrackingUrl,
        academyPhones: { create: { phone } },
        owners: { connect: { id: userId } },
        wallet: { create: { walletType: "ACADEMY" } },
      };

      return tx.academy.create({ data });
    });
  },

  async update({ body, params }) {
    const { name, profileTrackingUrl } = body;
    const { academyId } = params;

    return prisma.$transaction(async (tx) => {
      const academy = await tx.academy.findUnique({ where: { id: academyId } });

      if (!academy) throw ApiError.NotFound("Academy");

      if (name && academy.name !== name) {
        const nameExists = await tx.academy.findUnique({ where: { name } });
        if (nameExists) throw ApiError.Conflict("NAME_ALREADY_EXISTS");
      }

      const data: AcademyUpdateInput = {};

      if (name && academy.name !== name) {
        data.name = name
      }

      if (profileTrackingUrl) {
        data.profileTrackingUrl = profileTrackingUrl
      }

      return tx.academy.update({
        where: { id: academyId },
        data,
      });
    });
  },

  async delete({ params }) {
    const { academyId } = params;

    const academyExists = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { id: true }
    });
    if (!academyExists) throw ApiError.NotFound("Academy");

    return await prisma.academy.delete({
      where: { id: academyId },
    });
  },

  async getAll({ query }) {
    const { limit, page, ...filters } = query;

    const where = buildAcademyWhere(filters);

    const { take, skip } = buildPagination({ page, limit });

    const [academies, count] = await prisma.$transaction([
      prisma.academy.findMany({ where, take, skip }),
      prisma.academy.count({ where }),
    ]);

    const pagination = buildPaginationMeta({ limit, count, page });

    return { items: academies, pagination };
  },

  async getDetails({ params }) {
    const { academyId } = params;

    const academy = await prisma.academy.findUnique({
      where: { id: academyId },
      include: {
        academyPhones: true,
        addresses: true,
        owners: true,
        paymentLinks: true,
        socialMedia: true,
        academyRules: true,
        wallet: { where: { walletType: "ACADEMY" } }
      }
    });

    if (!academy) throw ApiError.NotFound("Academy");

    const academySafe = {
      ...academy,
      owners: academy.owners.map((u) =>
        omit(u, ["password", "logoutAt"])
      ),
    };

    return academySafe;
  },

  async addAddress({ body, params }) {
    const { address } = body;
    const { academyId } = params;

    const academyExists = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { id: true }
    });

    if (!academyExists) throw ApiError.NotFound("Academy");

    return await prisma.academy.update({
      where: { id: academyId },
      data: { addresses: { create: { address } } },
      include: { addresses: true }
    });
  },

  async deleteAddress({ params }) {
    const { academyId, addressId } = params;

    const academyCheck = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { addresses: { where: { id: addressId }, select: { id: true } } }
    });

    if (!academyCheck) throw ApiError.NotFound("Academy");
    if (academyCheck.addresses.length === 0) throw ApiError.NotFound("AcademyAddress");

    return await prisma.academy.update({
      where: { id: academyId },
      data: { addresses: { delete: { id: addressId } } },
      include: { addresses: true }
    });
  },

  async addPhone({ body, params }) {
    const { phone } = body;
    const { academyId } = params;

    const academyExists = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { id: true }
    });
    if (!academyExists) throw ApiError.NotFound("Academy");

    const phoneExists = await prisma.academyPhone.findUnique({ where: { phone } });
    if (phoneExists) throw ApiError.Conflict("PHONE_ALREADY_EXISTS");

    return await prisma.academy.update({
      where: { id: academyId },
      data: { academyPhones: { create: { phone } } },
      include: { academyPhones: true }
    });
  },

  async deletePhone({ params }) {
    const { academyId, phoneId } = params;

    const academyCheck = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { academyPhones: { where: { id: phoneId }, select: { id: true } } }
    });

    if (!academyCheck) throw ApiError.NotFound("Academy");
    if (academyCheck.academyPhones.length === 0) throw ApiError.NotFound("AcademyPhone");

    return await prisma.academy.update({
      where: { id: academyId },
      data: { academyPhones: { delete: { id: phoneId } } },
      include: { academyPhones: true }
    });
  },

  async addSocialMedia({ body, params }) {
    const { url, platform } = body;
    const { academyId } = params;

    const academyExists = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { id: true, socialMedia: { where: { platform }, select: { id: true } } }
    });

    if (!academyExists) throw ApiError.NotFound("Academy");

    if (academyExists.socialMedia.length > 0) {
      throw ApiError.Conflict("SOCIAL_MEDIA_ALREADY_EXISTS")
    }

    return await prisma.academy.update({
      where: { id: academyId },
      data: { socialMedia: { create: { url, platform } } },
      include: { socialMedia: true }
    });
  },

  async deleteSocialMedia({ params }) {
    const { academyId, socialMediaId } = params;

    const academyCheck = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { socialMedia: { where: { id: socialMediaId }, select: { id: true } } }
    });

    if (!academyCheck) throw ApiError.NotFound("Academy");
    if (academyCheck.socialMedia.length === 0) throw ApiError.NotFound("SocialMedia");

    return await prisma.academy.update({
      where: { id: academyId },
      data: { socialMedia: { delete: { id: socialMediaId } } },
      include: { socialMedia: true }
    });
  },

  async myAcademics({ userId, tx }) {
    const client = getClient(tx);
    return await client.academy.findMany({
      where: { owners: { some: { id: userId } } }
    });
  },

  async addOwner({ params }) {
    const { academyId, userId } = params;

    return await prisma.$transaction(async (tx) => {
      const academy = await tx.academy.findUnique({
        where: { id: academyId },
        include: { owners: true }
      });

      if (!academy) throw ApiError.NotFound("Academy");

      const isOwner = academy.owners.some(o => o.id === userId);

      if (isOwner) {
        return sanitizeAcademy(academy)
      }

      const user = await tx.user.findUnique({ where: { id: userId }, select: { id: true } });
      if (!user) throw ApiError.NotFound("User");

      const updatedAcademy = await tx.academy.update({
        where: { id: academyId },
        data: { owners: { connect: { id: userId } } },
        include: { owners: true }
      });

      return sanitizeAcademy(updatedAcademy)
    });
  },

  async deleteOwner({ params }) {
    const { academyId, userId } = params;

    const academy = await prisma.academy.findUnique({
      where: { id: academyId },
      include: { owners: true }
    });

    if (!academy) throw ApiError.NotFound("Academy");

    const isOwner = academy.owners.some(o => o.id === userId);
    if (!isOwner) {
      return sanitizeAcademy(academy)
    }

    const updatedAcademy = await prisma.academy.update({
      where: { id: academyId },
      data: { owners: { disconnect: { id: userId } } },
      include: { owners: true }
    });

    return sanitizeAcademy(updatedAcademy)
  },

  async addPaymentLink({ params, body }) {
    const { url, walletProvider, phone } = body;
    const { academyId } = params;

    const academyExists = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { id: true }
    });
    if (!academyExists) throw ApiError.NotFound("Academy");

    return await prisma.academy.update({
      where: { id: academyId },
      data: { paymentLinks: { create: { url, walletProvider, phone } } },
      include: { paymentLinks: true }
    });
  },

  async deletePaymentLink({ params }) {
    const { academyId, paymentLinkId } = params;

    const academyCheck = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { paymentLinks: { where: { id: paymentLinkId }, select: { id: true } } }
    });

    if (!academyCheck) throw ApiError.NotFound("Academy");
    if (academyCheck.paymentLinks.length === 0) throw ApiError.NotFound("PaymentLink");

    return await prisma.academy.update({
      where: { id: academyId },
      data: { paymentLinks: { delete: { id: paymentLinkId } } },
      include: { paymentLinks: true }
    });
  },

  async addRule({ body, params }) {
    const { content } = body;
    const { academyId } = params;

    const academyExists = await prisma.academy.findUnique({
      where: { id: academyId },
      select: { id: true }
    });

    if (!academyExists) throw ApiError.NotFound("Academy");

    return await prisma.academy.update({
      where: { id: academyId },
      data: {
        academyRules: {
          create: { content }
        }
      },
      include: {
        academyRules: true
      }
    });
  },

  async deleteRule({ params }) {
    const { academyId, ruleId } = params;

    const academyCheck = await prisma.academy.findUnique({
      where: { id: academyId },
      select: {
        academyRules: {
          where: { id: ruleId },
          select: { id: true }
        }
      }
    });

    if (!academyCheck) throw ApiError.NotFound("Academy");

    if (academyCheck.academyRules.length === 0) throw ApiError.NotFound("AcademyRule");

    return await prisma.academy.update({
      where: { id: academyId },
      data: {
        academyRules: {
          delete: {
            id: ruleId
          }
        }
      },
      include: {
        academyRules: true
      }
    });
  },
}

export default AcademyService;