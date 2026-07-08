import { Router } from "express";
import { checkAcademyExists } from "../academy/academy.middleware";
import validate from "../../shared/middlewares/validate.middleware";
import { GetDashboardAnalyticsSchema } from "./statistics.schema";
import DashboardController from "./statistics.controller";

const router = Router({ mergeParams: true });

router.use(checkAcademyExists({ isAcademyOwner: true }))


router.get(
    "/",
    validate(GetDashboardAnalyticsSchema),
    DashboardController.getStatistics
);

export default router;