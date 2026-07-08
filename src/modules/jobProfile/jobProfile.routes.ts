import { Router } from "express";
import JobProfileController from "./jobProfile.controller";
import * as Schema from "./jobProfile.schema";
import validate from "../../shared/middlewares/validate.middleware";
import { isAdmin } from "../admin/admin.middleware";

const router = Router();

router.get(
  "/",
  validate(Schema.getAllJobProfilesSchema),
  JobProfileController.getAllJobProfiles
);

router.use(isAdmin)

router.get(
  "/:jobProfileId",
  validate(Schema.getJobProfileDetailsSchema),
  JobProfileController.getJobProfileDetails
);

router.post(
  "/",
  validate(Schema.createJobProfileSchema),
  JobProfileController.createJobProfile
);

router.patch(
  "/:jobProfileId",
  validate(Schema.updateJobProfileSchema),
  JobProfileController.updateJobProfile
);

router.delete(
  "/:jobProfileId",
  validate(Schema.deleteJobProfileSchema),
  JobProfileController.deleteJobProfile
);

export default router;