import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import {
  buildPagination,
  buildPaginationMeta,
} from "../../shared/utils/Pagination";
import { buildAreaWhere, orderBy } from "./area.utils";
import { IAreaService } from "./area.type";

const AreaService: IAreaService = {
  async createArea({ body }) {

    const area = await prisma.area.findUnique({ where: { name: body.name } })
    if (area) throw ApiError.Conflict("NAME_ALREADY_EXISTS")

    return prisma.area.create({ data: body });
  },

  async updateArea({ params, body }) {
    const { areaId } = params;

    const area = await prisma.area.findFirst({ where: { id: areaId } });

    if (!area) throw ApiError.NotFound("Area");

    if (body.name && body.name !== area.name) {
      const area = await prisma.area.findUnique({ where: { name: body.name } })
      if (area) throw ApiError.Conflict("NAME_ALREADY_EXISTS")
    }

    return prisma.area.update({
      where: {
        id: areaId,
      },
      data: body,
    });
  },

  async deleteArea({ params }) {
    const { areaId } = params;

    const area = await prisma.area.findUnique({ where: { id: areaId } });

    if (!area) throw ApiError.NotFound("Area");

    return prisma.area.delete({
      where: {
        id: areaId,
      },
    });
  },

  async getAllAreas({ query }) {
    const { page, limit, search, isActive } = query;

    const where = buildAreaWhere({
      search,
      isActive,
    });

    const { take, skip } = buildPagination({ page, limit });

    const [items, count] = await prisma.$transaction([
      prisma.area.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.area.count({
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

  async getAreaDetails({ params }) {
    const { areaId } = params;

    const area = await prisma.area.findUnique({
      where: {
        id: areaId,
      },
    });

    if (!area) throw ApiError.NotFound("Area");

    return area;
  },
};

export default AreaService;