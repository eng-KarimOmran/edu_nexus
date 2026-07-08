import * as DTO from "./public.dto";
import PublicService from "./public.service";
import sendSuccess from "../../shared/utils/successResponse";
import { IPublicController } from "./public.type";

const PublicController: IPublicController = {
    async getAcademy(req, res) {
        const dataSafe = req.dataSafe as DTO.GetAcademyDto;

        const academy = await PublicService.getAcademy(dataSafe);

        return sendSuccess({
            res,
            data: academy,
        });
    },

    async getCourses(req, res) {
        const dataSafe = req.dataSafe as DTO.GetCoursesDto;

        const courses = await PublicService.getCourses(dataSafe);

        return sendSuccess({
            res,
            data: courses,
        });
    },

    async getAreas(req, res) {
        const dataSafe = req.dataSafe as DTO.GetAreasDto;

        const areas = await PublicService.getAreas(dataSafe);

        return sendSuccess({
            res,
            data: areas,
        });
    },

    async getClient(req, res) {
        const dataSafe = req.dataSafe as DTO.GetClientDto;

        const client = await PublicService.getClient(dataSafe);

        return sendSuccess({
            res,
            data: client,
        });
    },

    async register(req, res) {
        const dataSafe = req.dataSafe as DTO.RegisterDto;

        const result = await PublicService.register(dataSafe);

        return sendSuccess({
            res,
            statusCode: 201,
            data: result,
            message: "تم التسجيل بنجاح",
        });
    },
};

export default PublicController;