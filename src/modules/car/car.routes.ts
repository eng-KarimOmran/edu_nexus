import { Router } from "express";
import CarController from "./car.controller";
import * as Schema from "./car.schema";
import validate from "../../shared/middlewares/validate.middleware";
import { isAdmin } from "../admin/admin.middleware";

const router = Router();

router.get(
  "/",
  validate(Schema.GetAllCarsSchema),
  CarController.getAllCars
);


router.use(isAdmin)

router.post(
  "/",
  validate(Schema.CreateCarSchema),
  CarController.createCar
);

router.get(
  "/:carId",
  validate(Schema.GetCarDetailsSchema),
  CarController.getDetails
);

router.patch(
  "/:carId",
  validate(Schema.UpdateCarSchema),
  CarController.updateCar
);

router.delete(
  "/:carId",
  validate(Schema.DeleteCarSchema),
  CarController.deleteCar
);
export default router;