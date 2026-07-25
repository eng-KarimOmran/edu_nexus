import { Router } from "express";

import { TokenType } from "./modules/auth/auth.type";

import { auth, checkPasswordChange } from "./modules/auth/auth.middleware";

import routerAuth from "./modules/auth/auth.routes";
import routerAcademy from "./modules/academy/academy.routes";
import routerEmployee from "./modules/employee/employee.router";
import routerPublic from "./modules/public/public.routes";
import routerAdmin from "./modules/admin/admin.routes";
import PublicController from "./modules/public/public.controller";


const router = Router();

router.get(
    "/time-now",
    PublicController.timezoneOffset
);

router.use("/auth", routerAuth);

router.use("/public/:academyId", routerPublic);

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.use("/academies", routerAcademy);

router.use("/admin", routerAdmin)

router.use("/employee", routerEmployee);

export default router;