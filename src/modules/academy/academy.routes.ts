import { Router } from "express";
import validate from "../../shared/middlewares/validate.middleware";
import AcademyController from "./academy.controller";
import { checkAcademyExists } from "./academy.middleware";
import { AcademySchema } from "./academy.schema";
import { isAdmin } from '../admin/admin.middleware';

import routerCourse from "../course/course.routes";
import routerClient from "../client/client.routes";
import routerSubscription from "../subscription/subscription.routes";
import routerWalletMovement from "../walletMovement/walletMovement.routes";
import routerLesson from "../lesson/lesson.routes";
import routerStatistic from "../statistics/statistics.routes";

const router = Router();

// =======================
// General Academy Routes
// =======================


router.get(
  "/",
  validate(AcademySchema.getAll),
  AcademyController.getAll
);

router.post(
  "/",
  validate(AcademySchema.create),
  isAdmin,
  AcademyController.create
);

router.get(
  "/my-academics",
  AcademyController.myAcademics
);


// =======================
// Owners Routes
// =======================

router.use("/:academyId", checkAcademyExists())

router.post(
  "/:academyId/owner/:userId",
  validate(AcademySchema.owner.add),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.addOwner
);

router.delete(
  "/:academyId/owner/:userId",
  validate(AcademySchema.owner.delete),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.deleteOwner
);


router.post(
  "/:academyId/social-media",
  validate(AcademySchema.socialMedia.add),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.addSocialMedia
);

router.delete(
  "/:academyId/social-media/:socialMediaId",
  validate(AcademySchema.socialMedia.delete),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.deleteSocialMedia
);


router.post(
  "/:academyId/phone",
  validate(AcademySchema.phone.add),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.addPhone
);

router.delete(
  "/:academyId/phone/:phoneId",
  validate(AcademySchema.phone.delete),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.deletePhone
);


router.post(
  "/:academyId/address",
  validate(AcademySchema.address.add),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.addAddress
);

router.delete(
  "/:academyId/address/:addressId",
  validate(AcademySchema.address.delete),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.deleteAddress
);

router.post(
  "/:academyId/rule",
  validate(AcademySchema.rule.add),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.addRule
);

router.delete(
  "/:academyId/rule/:ruleId",
  validate(AcademySchema.rule.delete),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.deleteRule
);

router.post(
  "/:academyId/payment-link",
  validate(AcademySchema.paymentLink.add),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.addPaymentLink
);

router.delete(
  "/:academyId/payment-link/:paymentLinkId",
  validate(AcademySchema.paymentLink.delete),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.deletePaymentLink
);


router.get(
  "/:academyId",
  validate(AcademySchema.get),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.getDetails
);

router.patch(
  "/:academyId",
  validate(AcademySchema.update),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.update
);

router.delete(
  "/:academyId",
  validate(AcademySchema.delete),
  checkAcademyExists({ isAcademyOwner: true }),
  AcademyController.delete
);

// =======================
// Nested Routes Sub-router
// =======================

router.use("/:academyId/course", routerCourse);

router.use("/:academyId/client", routerClient);

router.use("/:academyId/subscription", routerSubscription);

router.use("/:academyId/wallet-movement", routerWalletMovement);

router.use("/:academyId/lesson", routerLesson);

router.use("/:academyId/statistic", routerStatistic);

export default router;