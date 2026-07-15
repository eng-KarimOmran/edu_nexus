import { Router } from "express";
import * as Schema from "./lesson.schema";
import controller from "./lesson.controller";
import { checkAcademyExists } from "../academy/academy.middleware";
import validate from "../../shared/middlewares/validate.middleware";
import allowJobProfiles from "../jobProfile/jobProfile.middlewares";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validate(Schema.CreateLessonSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  controller.createLesson,
);

router.get(
  "/",
  validate(Schema.GetAllLessonsSchema),
  checkAcademyExists({ isAcademyOwner: true }),
  controller.getAllLessons,
);

router.get(
  "/:lessonId",
  validate(Schema.GetLessonDetailsSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  controller.getLessonDetails,
);

router.patch(
  "/:lessonId/status",
  validate(Schema.ChangeLessonStateSchema),
  allowJobProfiles(["MANAGER", "SECRETARY", "CAPTAIN"]),
  controller.changeLessonState,
);

router.patch(
  "/:lessonId",
  validate(Schema.UpdateLessonSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  controller.updateLesson,
);

router.delete(
  "/:lessonId",
  validate(Schema.DeleteLessonSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  controller.deleteLesson,
);

export default router;