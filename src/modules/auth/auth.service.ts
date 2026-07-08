import dayjs from "dayjs";
import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import { IAuthService } from "./auth.type";
import { HashHelper, Token } from "./auth.utils";
import env from "../../config/env";
import { userSafe } from "../user/user.utils";

const AuthService: IAuthService = {
  async login({ phone, password }) {

    const userEx = await prisma.user.findUnique({
      where: { phone }, include: { academies: true, jobProfile: true },
    });

    if (!userEx) throw ApiError.InvalidCredentials();

    if (!userEx.isActive) throw ApiError.AccountBlocked()

    const isPasswordValid = await HashHelper.compare({ plainPassword: password, hashedPassword: userEx.password });
    if (!isPasswordValid) throw ApiError.InvalidCredentials();

    const { access, refresh } = Token.generateTokens(userEx.id);

    const user = userSafe(userEx)

    return { user, tokens: { access, refresh } };
  },

  refresh({ userLogin, jti }) {
    const access = Token.generateAccessToken(userLogin.id, jti);
    const user = userSafe(userLogin)
    return { user, access };
  },

  async logout({ allDevices, exp, userId, jti }) {
    const expiresAt = dayjs(exp).toDate();

    if (allDevices) {
      await prisma.user.update({ where: { id: userId }, data: { logoutAt: dayjs().toDate() } })
      return true
    }

    await prisma.blacklistedToken.create({ data: { jti, expiresAt } });

    await prisma.blacklistedToken.deleteMany({ where: { expiresAt: { lt: dayjs().toDate() } } });

    return true
  },

  async changePassword({ userId, password, newPassword, currentPassword }) {
    const isPasswordValid = await HashHelper.compare({ plainPassword: currentPassword, hashedPassword: password });
    if (!isPasswordValid) throw ApiError.InvalidCredentials({ password: true });
    const hashPassword = await HashHelper.hash(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashPassword, logoutAt: dayjs().toDate(), isPasswordChanged: true }
    });

    return true
  },

  async createFirstUser({ name, phone, email }) {
    const user = await prisma.user.findFirst({ select: { id: true } });

    if (user) throw ApiError.Conflict("USER_ALREADY_EXISTS");

    const hashPassword = await HashHelper.hash(env.app.DEFAULT_USER_PASSWORD)

    const newUser = await prisma.user.create({ data: { name, phone, password: hashPassword, isAdmin: true, email } })

    return { id: newUser.id, phone }
  },
}

export default AuthService;