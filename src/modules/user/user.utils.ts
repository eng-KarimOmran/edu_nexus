import dayjs from "dayjs";
import { User } from "@/prisma/generated/client";
import ApiError from "../../shared/utils/ApiError";
import { UserOrderByWithRelationInput, UserWhereInput } from "@/prisma/generated/models";
import { omit } from "../../shared/utils/omit";

export const assertCanModifyUser = ({
  currentUser,
  targetUser,
}: {
  currentUser: User;
  targetUser: User;
}) => {
  if (currentUser.id === targetUser.id) return;

  const currentIsNewer = dayjs(currentUser.createdAt).isAfter(dayjs(targetUser.createdAt));

  if (currentIsNewer) {
    throw ApiError.Forbidden();
  }
};

export const buildUserWhere = ({
  search,
  isActive,
  isAdmin
}: {
  search?: string;
  isActive?: boolean;
  isAdmin?: boolean
}): UserWhereInput => {
  const where: UserWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search,  } },
      { phone: { contains: search } },
    ];
  }

  if (typeof isActive === "boolean") {
    where.isActive = isActive;
  }

  if (typeof isAdmin === "boolean") {
    where.isAdmin = isAdmin
  }

  return where;
};

export const orderBy: UserOrderByWithRelationInput = { createdAt: "desc" }

export const userSafe = (user: User) => omit(user, ["password", "logoutAt"])