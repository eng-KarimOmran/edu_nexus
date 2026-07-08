import * as DTO from "./area.dto";
import AreaService from "./area.service";
import sendSuccess from "../../shared/utils/successResponse";
import { IAreaController } from "./area.type";

const AreaController: IAreaController = {
  createArea: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.CreateAreaDto;

    const area = await AreaService.createArea(dataSafe);

    return sendSuccess({
      res,
      statusCode: 201,
      data: area,
      message: "تم إنشاء المنطقة بنجاح",
    });
  },

  updateArea: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.UpdateAreaDto;

    const area = await AreaService.updateArea(dataSafe);

    return sendSuccess({
      res,
      data: area,
      message: "تم تحديث المنطقة بنجاح",
    });
  },

  deleteArea: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteAreaDto;

    await AreaService.deleteArea(dataSafe);

    return sendSuccess({
      res,
      message: "تم حذف المنطقة بنجاح",
    });
  },

  getAllAreas: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAllAreasDto;

    const data = await AreaService.getAllAreas(dataSafe);

    return sendSuccess({
      res,
      data,
    });
  },

  getAreaDetails: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAreaDetailsDto;

    const area = await AreaService.getAreaDetails(dataSafe);

    return sendSuccess({
      res,
      data: area,
    });
  },
};

export default AreaController;