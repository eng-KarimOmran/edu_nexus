import sendSuccess from "../../shared/utils/successResponse";
import EmployeeService from "./employee.service";
import { IEmployeeController } from "./employee.type";
import * as DTO from "./employee.dto";
import ApiError from "../../shared/utils/ApiError";

const EmployeeController: IEmployeeController = {
    getJobProfileDebts: async (req, res) => {
        const jobProfile = req.jobProfile
        if (!jobProfile) throw ApiError.BadRequest("ليس لديك ملف وظيفي")
        const wallets = await EmployeeService.getJobProfileDebts({ jobProfileId: jobProfile.id });
        return sendSuccess({ res, data: wallets });
    },

    getAllLessons: async (req, res) => {
        const dataSafe = req.dataSafe as DTO.GetAllLessonsDto;
        const lessons = await EmployeeService.getAllLessons(dataSafe);

        return sendSuccess({ res, data: lessons });
    },

    getClient: async (req, res) => {
        const dataSafe = req.dataSafe as DTO.GetClient;
        const client = await EmployeeService.getClient(dataSafe);

        return sendSuccess({ res, data: client });
    },

    getEmployeesWithDebts: async (_, res) => {
        const jobProfiles = await EmployeeService.getEmployeesWithDebts();

        return sendSuccess({ res, data: jobProfiles });
    },

    getAllCarAndLesson: async (req, res) => {
        const dataSafe = req.dataSafe as DTO.GetAllCarAndLessonDto;

        const data = await EmployeeService.getAllCarAndLesson(dataSafe);

        return sendSuccess({
            res,
            data,
        });
    },
    getAllEmployeesWithLesson: async (req, res) => {
        const dataSafe = req.dataSafe as DTO.GetAllEmployeesWithLessonDto;

        const data = await EmployeeService.getAllEmployeesWithLesson(dataSafe);
        
        return sendSuccess({
            res,
            data,
        });
    }
};

export default EmployeeController;