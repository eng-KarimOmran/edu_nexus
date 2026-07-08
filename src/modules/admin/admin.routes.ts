import { Router } from "express";
import routerJobProfile from "../jobProfile/jobProfile.routes";
import routerArea from "../area/area.routes";
import routerCar from "../car/car.routes";
import routerUser from "../user/user.routes";
import routerPayroll from "../payroll/payroll.routes";

const router = Router();

router.use("/job-profile", routerJobProfile);
router.use("/car", routerCar);
router.use("/area", routerArea);
router.use("/users", routerUser);
router.use("/payroll", routerPayroll);


export default router;