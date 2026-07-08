import { Router } from "express";
import * as Schema from "./walletMovement.schema";
import validate from "../../shared/middlewares/validate.middleware";
import { checkAcademyExists } from "../academy/academy.middleware";
import allowJobProfiles from "../jobProfile/jobProfile.middlewares";
import WalletMovementController from "./walletMovement.controller";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validate(Schema.ProcessPaymentTransactionSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  WalletMovementController.processPaymentTransaction
);

router.post(
  "/transfer-funds",
  validate(Schema.TransferFundsSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  WalletMovementController.transferFunds
);

router.get(
  "/",
  validate(Schema.GetAllWalletMovement),
  checkAcademyExists({ isAcademyOwner: true }),
  WalletMovementController.getAllWalletMovements
);

router.patch(
  "/:walletMovementId/change-status",
  validate(Schema.ChangeWalletMovementStatusSchema),
  checkAcademyExists({ isAcademyOwner: true }),
  WalletMovementController.changeWalletMovementStatus
);

router.get(
  "/:walletMovementId",
  validate(Schema.GetWalletMovementDetailsSchema),
  allowJobProfiles(["MANAGER", "SECRETARY"]),
  WalletMovementController.getWalletMovementDetails
);

export default router;