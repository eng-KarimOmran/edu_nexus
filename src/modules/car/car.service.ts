import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import {
  buildPagination,
  buildPaginationMeta,
} from "../../shared/utils/Pagination";
import { ICarService } from "./car.type";
import { buildCarWhere, orderBy } from "./cat.utils";

const CarService: ICarService = {
  async createCar({ body }) {
    const car = await prisma.car.findUnique({
      where: { plateNumber: body.plateNumber },
    });

    if (car) throw ApiError.Conflict("PLATE_NUMBER_ALREADY_EXISTS");

    return prisma.car.create({ data: body });
  },

  async updateCar({ params, body }) {
    const { carId } = params;

    const car = await prisma.car.findUnique({ where: { id: carId } });

    if (!car) throw ApiError.NotFound("Car");

    if (body.plateNumber && body.plateNumber !== car.plateNumber) {
      const car = await prisma.car.findUnique({
        where: { plateNumber: body.plateNumber },
      });
      if (car) throw ApiError.Conflict("PLATE_NUMBER_ALREADY_EXISTS");
    }

    return prisma.car.update({
      where: { id: carId },
      data: body,
    });
  },

  async deleteCar({ params }) {
    const { carId } = params;

    const car = await prisma.car.findUnique({ where: { id: carId } });

    if (!car) throw ApiError.NotFound("Car");

    return prisma.car.delete({
      where: {
        id: carId,
      },
    });
  },

  async getAllCars({ query }) {
    const { page, limit, search, gearType, isActive } = query;

    const where = buildCarWhere({
      search,
      gearType,
      isActive,
    });

    const { take, skip } = buildPagination({ page, limit });

    const [items, count] = await prisma.$transaction([
      prisma.car.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.car.count({ where }),
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

  async getDetails({ params }) {
    const { carId } = params;

    const car = await prisma.car.findUnique({ where: { id: carId } });

    if (!car) throw ApiError.NotFound("Car");

    return car;
  },
};

export default CarService;