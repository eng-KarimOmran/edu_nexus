import * as DTO from "./car.dto";
import CarService from "./car.service";
import sendSuccess from "../../shared/utils/successResponse";
import { ICarController } from "./car.type";

const CarController: ICarController = {
  createCar: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.CreateDto;

    const car = await CarService.createCar(dataSafe);

    return sendSuccess({
      res,
      statusCode: 201,
      data: car,
      message: "تم إنشاء السيارة بنجاح",
    });
  },

  updateCar: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.UpdateDto;

    const car = await CarService.updateCar(dataSafe);

    return sendSuccess({
      res,
      data: car,
      message: "تم تحديث السيارة بنجاح",
    });
  },

  deleteCar: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteDto;

    await CarService.deleteCar(dataSafe);

    return sendSuccess({
      res,
      message: "تم حذف السيارة بنجاح",
    });
  },

  getAllCars: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAllDto;

    const data = await CarService.getAllCars(dataSafe);

    return sendSuccess({
      res,
      data,
    });
  },

  getDetails: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetDetailsDto;

    const car = await CarService.getDetails(dataSafe);

    return sendSuccess({
      res,
      data: car,
    });
  },
};

export default CarController;