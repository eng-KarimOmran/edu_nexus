import { Response } from "express";
import * as DTO from "./auth.dto";
import AuthService from "./auth.service";
import sendSuccess from "../../shared/utils/successResponse";
import { cookieAccess, cookieRefresh } from "./auth.utils";
import { RequestAuth } from "./auth.type";
import { RequestValidation } from "../../shared/middlewares/validate.middleware";

const AuthController = {
  login: async (req: RequestValidation, res: Response) => {
    const dataSafe = req.dataSafe as DTO.LoginDto;
    const { body } = dataSafe

    const { tokens, user } = await AuthService.login(body);

    res.cookie("access", tokens.access, cookieAccess);

    res.cookie("refresh", tokens.refresh, cookieRefresh);

    return sendSuccess({
      res,
      data: { tokens, user },
      message: "تم تسجيل الدخول بنجاح",
    });
  },

  refresh: async (req: RequestAuth, res: Response) => {
    const userLogin = req.userLogin!
    const jti = req.tokenPayload!.jti

    const { access, user } = AuthService.refresh({ userLogin, jti });

    res.cookie("access", access, cookieAccess);


    return sendSuccess({
      res,
      data: { access, user },
      message: "تم تجديد صلاحية الدخول بنجاح",
    });
  },

  logout: async (req: RequestAuth, res: Response) => {
    const dataSafe = req.dataSafe as DTO.LogoutDto;
    const { allDevices } = dataSafe.query
    const userId = req.userLogin!.id
    const { jti, exp } = req.tokenPayload!

    await AuthService.logout({ allDevices, exp, jti, userId });

    res.clearCookie("access", cookieAccess);
    res.clearCookie("refresh", cookieRefresh);

    return sendSuccess({
      res,
      data: true,
      message: "تم تسجيل الخروج بنجاح",
    });
  },

  changePassword: async (req: RequestAuth, res: Response) => {
    const { password, id } = req.userLogin!;
    const dataSafe = req.dataSafe as DTO.ChangePasswordDto;
    const { body } = dataSafe


    await AuthService.changePassword({ ...body, password, userId: id });

    res.clearCookie("access", cookieAccess);
    res.clearCookie("refresh", cookieRefresh);

    return sendSuccess({
      res,
      data: true,
      message: "تم تغيير كلمة المرور بنجاح",
    });
  },


  createFirstUser: async (req: RequestValidation, res: Response) => {
    const dataSafe = req.dataSafe as DTO.createFirstUserDto
    const body = dataSafe.body

    const data = await AuthService.createFirstUser(body);

    res.clearCookie("access", cookieAccess);
    res.clearCookie("refresh", cookieRefresh);

    return sendSuccess({
      res,
      statusCode: 201,
      data,
      message: "تم إنشاء المستخدم بنجاح",
    });
  },
};

export default AuthController;