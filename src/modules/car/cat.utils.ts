import { Transmission } from "@/prisma/generated/enums";
import { CarOrderByWithRelationInput, CarWhereInput } from "@/prisma/generated/models";

export const buildCarWhere = ({
  search,
  gearType,
  isActive,
}: {
  search?: string;
  isActive?: boolean;
  gearType?: Transmission;
}): CarWhereInput => {
  const where: CarWhereInput = {};

  if (search) {
    where.OR = [
      { modelName: { contains: search,  } },
      { plateNumber: { contains: search,  } },
    ];
  }

  if (gearType) {
    where.gearType = gearType;
  }

  if (typeof isActive !== "undefined") {
    where.isActive = isActive;
  }

  return where;
};

export const orderBy: CarOrderByWithRelationInput = {
  createdAt: "desc",
}