import { Router } from "express";
import PublicController from "./public.controller";
import * as Schema from "./public.schema";
import validate from "../../shared/middlewares/validate.middleware";

const router = Router({ mergeParams: true });

router.get(
    "/",
    validate(Schema.GetAcademySchema),
    PublicController.getAcademy
);

router.get(
    "/courses",
    validate(Schema.GetCoursesSchema),
    PublicController.getCourses
);

router.get(
    "/areas",
    validate(Schema.GetAreasSchema),
    PublicController.getAreas
);

router.get(
    "/client/:clientId",
    validate(Schema.GetClientSchema),
    PublicController.getClient
);

router.post(
    "/captains",
    PublicController.getCaptains
);


router.post(
    "/register",
    validate(Schema.RegisterSchema),
    PublicController.register
);

export default router;