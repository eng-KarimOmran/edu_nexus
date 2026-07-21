import { Router } from "express";
import validate from "../../shared/middlewares/validate.middleware";
import allowJobProfiles from "../jobProfile/jobProfile.middlewares";
import EmployeeController from "./employee.controller";
import * as Schema from "./employee.schema";

const router = Router();

router.get(
    "/lessons",
    validate(Schema.getAllLessonsSchema),
    allowJobProfiles(["CAPTAIN", "MANAGER", "SECRETARY"]),
    EmployeeController.getAllLessons,
);

router.get(
    "/all-debts",
    allowJobProfiles(["MANAGER"]),
    EmployeeController.getEmployeesWithDebts,
);

router.get(
    "/my-debts",
    allowJobProfiles(["CAPTAIN", "MANAGER", "SECRETARY"]),
    EmployeeController.getJobProfileDebts,
);

router.get(
    "/client",
    validate(Schema.getClientSchema),
    allowJobProfiles(["MANAGER", "SECRETARY"]),
    EmployeeController.getClient,
);

router.get(
    "/lessons-and-car",
    validate(Schema.GetAllCarAndLessonSchema),
    allowJobProfiles(["MANAGER", "SECRETARY"]),
    EmployeeController.getAllCarAndLesson
);

router.get(
    "/employees-with-lesson",
    validate(Schema.GetAllEmployeesWithLessonSchema),
    allowJobProfiles(["MANAGER"]),
    EmployeeController.getAllEmployeesWithLesson
);

export default router;