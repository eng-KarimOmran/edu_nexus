import * as DTO from "./course.dto";
import CourseService from "./course.service";
import sendSuccess from "../../shared/utils/successResponse";
import { ICourseController } from "./course.type";

const CourseController: ICourseController = {
  createCourse: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.CreateCourseDto;

    const course = await CourseService.createCourse(dataSafe);

    return sendSuccess({
      res,
      statusCode: 201,
      data: course,
      message: "تم إنشاء الكورس بنجاح",
    });
  },

  updateCourse: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.UpdateCourseDto;

    const course = await CourseService.updateCourse(dataSafe);

    return sendSuccess({
      res,
      data: course,
      message: "تم تحديث الكورس بنجاح",
    });
  },

  deleteCourse: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteCourseDto;

    await CourseService.deleteCourse(dataSafe);

    return sendSuccess({
      res,
      message: "تم حذف الكورس بنجاح",
    });
  },

  getAllCourses: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAllCoursesDto;

    const data = await CourseService.getAllCourses(dataSafe);

    return sendSuccess({
      res,
      data,
    });
  },

  getCourseDetails: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetCourseDetailsDto;

    const course = await CourseService.getCourseDetails(dataSafe);

    return sendSuccess({
      res,
      data: course,
    });
  },

  addCourseFeature: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.AddCourseFeaturesDto;

    const course = await CourseService.addCourseFeature(dataSafe);

    return sendSuccess({
      res,
      data: course,
      message: "تم إضافة الميزة بنجاح",
    });
  },

  deleteCourseFeature: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteCourseFeaturesDto;

    const course = await CourseService.deleteCourseFeature(dataSafe);

    return sendSuccess({
      res,
      data: course,
      message: "تم حذف الميزة بنجاح",
    });
  },
};

export default CourseController;