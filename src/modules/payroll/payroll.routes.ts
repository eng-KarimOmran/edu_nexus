import { Router } from "express";
import * as Schema from "./payroll.schema";
import controller from "./payroll.controller";
import validate from "../../shared/middlewares/validate.middleware";
import allowJobProfiles from "../jobProfile/jobProfile.middlewares";

const router = Router();

router.post(
    "/",
    validate(Schema.createPayrollSchema),
    allowJobProfiles(["MANAGER"]),
    controller.createPayroll,
);

router.get(
    "/:jobProfileId",
    validate(Schema.getAllSchemaPayroll),
    allowJobProfiles(["MANAGER"]),
    controller.getAllPayroll,
);

router.delete(
    "/:payrollId",
    validate(Schema.deletePayrollSchema),
    allowJobProfiles(["MANAGER"]),
    controller.deletePayroll,
);

export default router;