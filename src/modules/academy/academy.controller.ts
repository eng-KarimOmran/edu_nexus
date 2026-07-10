import * as DTO from "./academy.dto";
import AcademyService from "./academy.service";
import sendSuccess from "../../shared/utils/successResponse";
import { IAcademyController } from "./academy.type";

const AcademyController: IAcademyController = {
  create: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.CreateAcademyDto;
    const academy = await AcademyService.create(dataSafe);

    return sendSuccess({
      res,
      statusCode: 201,
      data: academy,
      message: "تم إنشاء الأكاديمية بنجاح",
    });
  },

  myAcademics: async (req, res) => {
    const userId = req.userLogin!.id;
    const data = await AcademyService.myAcademics({ userId });

    return sendSuccess({
      res,
      data,
    });
  },

  update: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.UpdateAcademyDto;
    const updatedAcademy = await AcademyService.update(dataSafe);

    return sendSuccess({
      res,
      data: updatedAcademy,
      message: "تم تحديث الأكاديمية بنجاح",
    });
  },

  delete: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteAcademyDto;
    await AcademyService.delete(dataSafe);

    return sendSuccess({
      res,
      message: "تم حذف الأكاديمية بنجاح",
    });
  },

  getAll: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAllAcademiesDto;
    const data = await AcademyService.getAll(dataSafe);

    return sendSuccess({ res, data });
  },

  getDetails: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAcademyDetailsDto;
    const academy = await AcademyService.getDetails(dataSafe);

    return sendSuccess({ res, data: academy });
  },

  addOwner: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.AddOwnerDto;
    const data = await AcademyService.addOwner(dataSafe);

    return sendSuccess({
      res,
      statusCode: 201,
      data,
      message: "تم إضافة المالك بنجاح",
    });
  },

  deleteOwner: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteOwnerDto;
    const data = await AcademyService.deleteOwner(dataSafe);

    return sendSuccess({
      res,
      data,
      message: "تم حذف المالك بنجاح",
    });
  },

  addSocialMedia: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.AddSocialMediaDto;
    const data = await AcademyService.addSocialMedia(dataSafe);

    return sendSuccess({
      res,
      statusCode: 201,
      data,
      message: "تم إضافة المنصة بنجاح",
    });
  },

  deleteSocialMedia: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteSocialMediaDto;

    const data = await AcademyService.deleteSocialMedia(dataSafe);

    return sendSuccess({
      res,
      data,
      message: "تم حذف المنصة بنجاح",
    });
  },

  addPhone: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.AddPhoneDto

    const data = await AcademyService.addPhone(dataSafe);

    return sendSuccess({
      res,
      data,
      message: "تم اضافة رقم الهاتف بنجاح",
    });
  },

  deletePhone: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeletePhoneDto

    const data = await AcademyService.deletePhone(dataSafe);

    return sendSuccess({
      res,
      data,
      message: "تم حذف رقم الهاتف بنجاح",
    });
  },

  addAddress: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.AddAddressDto

    const data = await AcademyService.addAddress(dataSafe);

    return sendSuccess({
      res,
      data,
      message: "تم اضافة العنوان بنجاح",
    });
  },

  deleteAddress: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteAddressDto;

    const data = await AcademyService.deleteAddress(dataSafe);

    return sendSuccess({
      res,
      data,
      message: "تم حذف العنوان بنجاح",
    });
  },

  addPaymentLink: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.AddPaymentLinkDto;

    const data = await AcademyService.addPaymentLink(dataSafe);

    return sendSuccess({
      res,
      data,
      message: "تم اضافة رابط الدفع بنجاح",
    });
  },

  deletePaymentLink: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeletePaymentLinkDto;

    const data = await AcademyService.deletePaymentLink(dataSafe);

    return sendSuccess({
      res,
      data,
      message: "تم حذف رابط الدفع بنجاح",
    });
  },

  addRule: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.AddRuleDto;

    const data = await AcademyService.addRule(dataSafe);

    return sendSuccess({
      res,
      data,
      message: "تم إضافة القاعدة بنجاح",
    });
  },

  deleteRule: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteRuleDto;

    const data = await AcademyService.deleteRule(dataSafe);

    return sendSuccess({
      res,
      data,
      message: "تم حذف القاعدة بنجاح",
    });
  },
};

export default AcademyController;