import { IUserService } from "./user.type";
import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import { HashHelper } from "../auth/auth.utils";
import env from "../../config/env";
import { assertCanModifyUser, buildUserWhere, orderBy, userSafe } from "./user.utils";
import dayjs from "dayjs";
import { buildPagination, buildPaginationMeta } from "../../shared/utils/Pagination";

const UserService: IUserService = {
  async createUser({ body }) {
    const { name, phone } = body;

    const userExPhone = await prisma.user.findUnique({
      where: { phone },
    });

    if (userExPhone) throw ApiError.Conflict("PHONE_ALREADY_EXISTS");

    const hashPassword = await HashHelper.hash(env.app.DEFAULT_USER_PASSWORD);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashPassword,
      },
    });
    return userSafe(user)
  },

  async updateUser(dataSafe, currentUser) {
    const { params, body } = dataSafe;
    const { userId } = params

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) throw ApiError.NotFound("User");

    assertCanModifyUser({ currentUser, targetUser })

    if (body.phone && body.phone !== targetUser.phone) {
      const phoneExists = await prisma.user.findUnique({
        where: { phone: body.phone },
      });

      if (phoneExists) {
        throw ApiError.Conflict("PHONE_ALREADY_EXISTS");
      }
    }

    if (body.email && body.email !== targetUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (emailExists) {
        throw ApiError.Conflict("EMAIL_ALREADY_EXISTS");
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: body,
    });

    return userSafe(user)
  },

  async deleteUser(dataSafe, currentUser) {
    const { params } = dataSafe;
    const { userId } = params

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) throw ApiError.NotFound("User");

    assertCanModifyUser({ currentUser, targetUser })

    const user = await prisma.user.delete({
      where: { id: userId },
    });

    return userSafe(user)
  },

  async getAllUsers(dataSafe) {
    const { limit, page, ...filters } = dataSafe.query;

    const pagination = buildPagination({ page, limit })

    const where = buildUserWhere(filters)

    const { users, count } = await prisma.$transaction(async (tx) => {
      const [users, count] = await Promise.all(
        [
          tx.user.findMany({ where, ...pagination, orderBy }),
          tx.user.count({ where })
        ]
      )
      return { users, count }
    })

    const usersSafe = users.map((u) => userSafe(u))

    const paginationMeta = buildPaginationMeta({ limit, page, count })

    return { items: usersSafe, pagination: paginationMeta }
  },

  async getUserDetails({ params }) {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        academies: true,
        jobProfile: true
      },
    })

    if (!user) throw ApiError.NotFound("User");


    return userSafe(user)
  },

  async newPassword(dataSafe, currentUser) {
    const { params, body } = dataSafe;
    const { userId } = params
    const { newPassword } = body

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) throw ApiError.NotFound("User");

    assertCanModifyUser({ currentUser, targetUser })

    const hashPassword = await HashHelper.hash(newPassword);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashPassword,
        isPasswordChanged: false,
        logoutAt: dayjs().toDate(),
      },
    });

    return userSafe(user)
  },
};

export default UserService