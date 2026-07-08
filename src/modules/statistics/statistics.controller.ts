import { Response } from "express";
import DashboardService from "./statistics.service";
import sendSuccess from "../../shared/utils/successResponse";
import * as DTO from "./statistics.dto";
import { RequestAcademy } from "../academy/academy.type";

const DashboardController = {
  getStatistics: async (req: RequestAcademy, res: Response) => {
    const dataSafe = req.dataSafe as DTO.GetDashboardAnalyticsDto;

    const [
      clients,
      courses,
      subscriptions,
      ledgerTransaction,
      lessons,
      area,
      car,
      captain,
      usersCreatedSubscription,
    ] = await Promise.all([
      DashboardService.clients({ dataSafe }),
      DashboardService.courses({ dataSafe }),
      DashboardService.subscriptions({ dataSafe }),
      DashboardService.ledgerTransaction({ dataSafe }),
      DashboardService.lessons({ dataSafe }),
      DashboardService.area({ dataSafe }),
      DashboardService.car({ dataSafe }),
      DashboardService.captain({ dataSafe }),
      DashboardService.usersCreatedSubscription({ dataSafe }),
    ]);

    return sendSuccess({
      res,
      data: {
        clients,
        courses,
        subscriptions,
        ledgerTransaction,
        lessons,
        area,
        car,
        captain,
        usersCreatedSubscription,
      },
      message: "تم توليد وتحليل بيانات لوحة التحكم بنجاح.",
    });
  },
};

export default DashboardController;