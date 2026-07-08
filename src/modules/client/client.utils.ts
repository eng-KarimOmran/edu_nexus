import {
  ClientOrderByWithRelationInput,
  ClientWhereInput,
} from "@/prisma/generated/models";
import { ClientSource } from "@/prisma/generated/enums";

export const buildClientWhere = ({
  academyId,
  search,
  source,
}: {
  academyId: string;
  search?: string;
  source?: ClientSource;
}): ClientWhereInput => {
  const where: ClientWhereInput = { academyId }

  if (search) {
    where.OR = [
      {
        id: { contains: search }
      },
      {
        name: { contains: search,  }
      },
      {
        phone: { contains: search }
      }
    ]
  }

  if (source) {
    where.source = source
  }

  return where
}

export const orderBy: ClientOrderByWithRelationInput = {
  createdAt: "desc",
};