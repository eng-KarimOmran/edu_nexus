import { Router } from "express";
import validate from "../../shared/middlewares/validate.middleware";
import * as Schema from "./client.schema";
import ClientController from "./client.controller";
import { checkAcademyExists } from "../academy/academy.middleware";
import allowJobProfiles from "../jobProfile/jobProfile.middlewares";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validate(Schema.CreateClientSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  ClientController.create
);

router.get(
  "/details",
  validate(Schema.GetClientDetailsSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  ClientController.getDetails
);

router.patch(
  "/:clientId",
  validate(Schema.UpdateClientSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  ClientController.update
);

router.get(
  "/",
  validate(Schema.GetAllClientsSchema),
  checkAcademyExists({ isAcademyOwner: true }),
  ClientController.getAll
);

router.delete(
  "/:clientId",
  validate(Schema.DeleteClientSchema),
  checkAcademyExists({ isAcademyOwner: true }),
  ClientController.delete
);

export default router;