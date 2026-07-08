import { AcademyGetPayload, AcademyWhereInput } from "@/prisma/generated/models";
import { SafeUser } from "../user/user.type";
import { userSafe } from "../user/user.utils";

export const buildAcademyWhere = ({
  search,
}: {
  search?: string;
}): AcademyWhereInput => {
  const where: AcademyWhereInput = {};

  if (search) {
    where.OR = [
      { id: { startsWith: search,  } },
      { name: { contains: search,  } },
    ];
  }

  return where;
};

export const sanitizeAcademy = (academy: AcademyGetPayload<{ include: { owners: true } }>): Omit<AcademyGetPayload<{ include: { owners: true } }>, "owners"> & { owners: SafeUser[] } => {
  return { ...academy, owners: academy.owners.map((u) => userSafe(u)) }
}