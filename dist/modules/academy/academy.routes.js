"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = __importDefault(require("../../shared/middlewares/validate.middleware"));
const academy_controller_1 = __importDefault(require("./academy.controller"));
const academy_middleware_1 = require("./academy.middleware");
const academy_schema_1 = require("./academy.schema");
const admin_middleware_1 = require("../admin/admin.middleware");
const course_routes_1 = __importDefault(require("../course/course.routes"));
const client_routes_1 = __importDefault(require("../client/client.routes"));
const subscription_routes_1 = __importDefault(require("../subscription/subscription.routes"));
const walletMovement_routes_1 = __importDefault(require("../walletMovement/walletMovement.routes"));
const lesson_routes_1 = __importDefault(require("../lesson/lesson.routes"));
const statistics_routes_1 = __importDefault(require("../statistics/statistics.routes"));
const router = (0, express_1.Router)();
// =======================
// General Academy Routes
// =======================
router.get("/", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.getAll), academy_controller_1.default.getAll);
router.post("/", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.create), admin_middleware_1.isAdmin, academy_controller_1.default.create);
router.get("/my-academics", academy_controller_1.default.myAcademics);
// =======================
// Owners Routes
// =======================
router.use("/:academyId", (0, academy_middleware_1.checkAcademyExists)());
router.post("/:academyId/owner/:userId", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.owner.add), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.addOwner);
router.delete("/:academyId/owner/:userId", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.owner.delete), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.deleteOwner);
router.post("/:academyId/social-media", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.socialMedia.add), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.addSocialMedia);
router.delete("/:academyId/social-media/:socialMediaId", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.socialMedia.delete), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.deleteSocialMedia);
router.post("/:academyId/phone", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.phone.add), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.addPhone);
router.delete("/:academyId/phone/:phoneId", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.phone.delete), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.deletePhone);
router.post("/:academyId/address", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.address.add), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.addAddress);
router.delete("/:academyId/address/:addressId", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.address.delete), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.deleteAddress);
router.post("/:academyId/rule", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.rule.add), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.addRule);
router.delete("/:academyId/rule/:ruleId", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.rule.delete), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.deleteRule);
router.post("/:academyId/payment-link", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.paymentLink.add), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.addPaymentLink);
router.delete("/:academyId/payment-link/:paymentLinkId", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.paymentLink.delete), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.deletePaymentLink);
router.get("/:academyId", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.get), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.getDetails);
router.patch("/:academyId", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.update), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.update);
router.delete("/:academyId", (0, validate_middleware_1.default)(academy_schema_1.AcademySchema.delete), (0, academy_middleware_1.checkAcademyExists)({ isAcademyOwner: true }), academy_controller_1.default.delete);
// =======================
// Nested Routes Sub-router
// =======================
router.use("/:academyId/course", course_routes_1.default);
router.use("/:academyId/client", client_routes_1.default);
router.use("/:academyId/subscription", subscription_routes_1.default);
router.use("/:academyId/wallet-movement", walletMovement_routes_1.default);
router.use("/:academyId/lesson", lesson_routes_1.default);
router.use("/:academyId/statistic", statistics_routes_1.default);
exports.default = router;
