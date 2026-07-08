import { Response } from "express";
import * as DTO from "./user.dto";
import UserService from "./user.service";
import sendSuccess from "../../shared/utils/successResponse";
import { RequestAuth } from "../auth/auth.type";

const UserController = {
  createUser: async (req: RequestAuth, res: Response) => {
    const dataSafe = req.dataSafe as DTO.CreateUserDto;

    const user = await UserService.createUser({ body: dataSafe.body });

    return sendSuccess({
      res,
      statusCode: 201,
      data: user,
      message: "تم إنشاء المستخدم بنجاح",
    });
  },

  updateUser: async (req: RequestAuth, res: Response) => {
    const currentUser = req.userLogin!;
    const dataSafe = req.dataSafe as DTO.UpdateUserDto;

    const updatedUser = await UserService.updateUser(dataSafe, currentUser);

    return sendSuccess({
      res,
      data: updatedUser,
      message: "تم تحديث المستخدم بنجاح",
    });
  },

  deleteUser: async (req: RequestAuth, res: Response) => {
    const currentUser = req.userLogin!;
    const dataSafe = req.dataSafe as DTO.DeleteUserDto;

    await UserService.deleteUser(dataSafe, currentUser);

    return sendSuccess({
      res,
      message: "تم حذف المستخدم نهائيًا",
    });
  },

  getAllUser: async (req: RequestAuth, res: Response) => {
    const dataSafe = req.dataSafe as DTO.GetAllUsersDto;

    const data = await UserService.getAllUsers(dataSafe);

    return sendSuccess({
      res,
      data,
    });
  },

  getDetailsUser: async (req: RequestAuth, res: Response) => {
    const dataSafe = req.dataSafe as DTO.GetUserDetailsDto;

    const user = await UserService.getUserDetails(dataSafe);

    return sendSuccess({ res, data: user });
  },

  newPassword: async (req: RequestAuth, res: Response) => {
    const dataSafe = req.dataSafe as DTO.NewPasswordDto;
    const currentUser = req.userLogin!;

    const user = await UserService.newPassword(dataSafe, currentUser);

    return sendSuccess({ res, data: user });
  }
};

export default UserController;