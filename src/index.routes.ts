import { Router } from "express";

import { TokenType } from "./modules/auth/auth.type";

import { auth, checkPasswordChange } from "./modules/auth/auth.middleware";

import routerAuth from "./modules/auth/auth.routes";
import routerAcademy from "./modules/academy/academy.routes";
import routerEmployee from "./modules/employee/employee.router";
import routerPublic from "./modules/public/public.routes";
import routerAdmin from "./modules/admin/admin.routes";


const router = Router();

router.use("/auth", routerAuth);

router.use("/public/:academyId", routerPublic);

router.use(auth(TokenType.ACCESS), checkPasswordChange);

router.use("/academies", routerAcademy);

router.use("/admin", routerAdmin)

router.use("/employee", routerEmployee);

export default router;