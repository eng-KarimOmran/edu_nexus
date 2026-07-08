import { SupportType } from "@/prisma/generated/enums";
import { AreaOrderByWithRelationInput, AreaWhereInput } from "@/prisma/generated/models";

export const buildAreaWhere = ({
  search,
  isActive,
  supportType,
}: {
  search?: string;
  isActive?: boolean;
  supportType?: SupportType;
}): AreaWhereInput => {
  const where: AreaWhereInput = {};

  if (search) {
    where.OR = [
      { id: { startsWith: search,  } },
      { name: { contains: search,  } },
    ];
  }

  if (typeof isActive !== "undefined") {
    where.isActive = isActive;
  }

  if (supportType) {
    where.supportType = {
      in: ["BOTH", supportType],
    };
  }

  return where;
};

export const orderBy: AreaOrderByWithRelationInput = {
  createdAt: "desc",
}