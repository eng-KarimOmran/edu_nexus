import { Router } from "express";
import CourseController from "./course.controller";
import * as Schema from "./course.schema";
import validate from "../../shared/middlewares/validate.middleware";
import { checkAcademyExists } from "../academy/academy.middleware";
import allowJobProfiles from "../jobProfile/jobProfile.middlewares";

const router = Router({ mergeParams: true });

router.get(
  "/",
  validate(Schema.GetAllSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  CourseController.getAllCourses
);

router.post(
  "/",
  validate(Schema.CreateSchema),
  checkAcademyExists({ isAcademyOwner: true }),
  CourseController.createCourse
);

router.get(
  "/:courseId",
  validate(Schema.GetDetailsSchema),
  checkAcademyExists({ isAcademyOwner: true }),
  CourseController.getCourseDetails
);

router.patch(
  "/:courseId",
  validate(Schema.UpdateSchema),
  checkAcademyExists({ isAcademyOwner: true }),
  CourseController.updateCourse
);

router.delete(
  "/:courseId",
  validate(Schema.DeleteSchema),
  checkAcademyExists({ isAcademyOwner: true }),
  CourseController.deleteCourse
);

router.post(
  "/:courseId/features",
  validate(Schema.AddCourseFeaturesSchema),
  checkAcademyExists({ isAcademyOwner: true }),
  CourseController.addCourseFeature
);

router.delete(
  "/:courseId/features/:featureId",
  validate(Schema.DeleteCourseFeaturesSchema),
  checkAcademyExists({ isAcademyOwner: true }),
  CourseController.deleteCourseFeature
);

export default router;