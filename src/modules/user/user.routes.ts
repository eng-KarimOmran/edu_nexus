import { Router } from "express";
import validate from "../../shared/middlewares/validate.middleware";
import * as Schema from "./user.schema";
import UserController from "./user.controller";
import { isAdmin } from "../admin/admin.middleware";

const router = Router();

router.get(
  "/",
  validate(Schema.GetAllUsersSchema),
  UserController.getAllUser,
);

router.use(isAdmin)

router.post(
  "/",
  validate(Schema.CreateUserSchema),
  UserController.createUser,
);

router.get(
  "/:userId",
  validate(Schema.GetUserDetailsSchema),
  UserController.getDetailsUser,
);

router.patch(
  "/:userId/new-password",
  validate(Schema.newPasswordSchema),
  UserController.newPassword,
);

router.patch(
  "/:userId",
  validate(Schema.UpdateUserSchema),
  UserController.updateUser,
);

router.delete(
  "/:userId",
  validate(Schema.DeleteUserSchema),
  UserController.deleteUser,
);

export default router;