import * as DTO from "./subscription.dto";
import SubscriptionService from "./subscription.service";
import sendSuccess from "../../shared/utils/successResponse";
import { ISubscriptionController } from "./subscription.type";

const SubscriptionController: ISubscriptionController = {
  createSubscription: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.CreateSubscriptionDto;
    const userId = req.userLogin!.id

    const subscription = await SubscriptionService.createSubscription({ data: dataSafe, userId });

    return sendSuccess({
      res,
      statusCode: 201,
      data: subscription,
      message: "تم إنشاء الاشتراك بنجاح",
    });
  },

  getAllSubscriptions: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAllSubscriptionsDto;

    const data = await SubscriptionService.getAllSubscriptions(dataSafe);

    return sendSuccess({
      res,
      data,
    });
  },

  getSubscriptionDetails: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetSubscriptionDetailsDto;

    const subscription = await SubscriptionService.getSubscriptionDetails(dataSafe);

    return sendSuccess({
      res,
      data: subscription,
    });
  },

  deleteSubscription: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteSubscriptionDto;

    const subscription = await SubscriptionService.deleteSubscription(dataSafe);

    return sendSuccess({
      res,
      data: subscription,
      message: "تم حذف الاشتراك بنجاح",
    });
  },

  cancelSubscription: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.CancelSubscriptionDto;

    const subscription = await SubscriptionService.cancelSubscription(dataSafe);

    return sendSuccess({
      res,
      data: subscription,
      message: "تم إلغاء الاشتراك بنجاح",
    });
  },
};

export default SubscriptionController;