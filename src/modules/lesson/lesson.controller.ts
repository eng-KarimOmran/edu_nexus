import * as DTO from "./lesson.dto";
import LessonService from "./lesson.service";
import sendSuccess from "../../shared/utils/successResponse";
import { ILessonController } from "./lesson.type";

const LessonController: ILessonController = {
  createLesson: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.CreateLessonDto;

    const lesson = await LessonService.createLesson(dataSafe);

    return sendSuccess({
      res,
      statusCode: 201,
      data: lesson,
      message: "تمت جدولة الحصة بنجاح.",
    });
  },

  getAllLessons: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetAllLessonsDto;

    const data = await LessonService.getAllLessons(dataSafe);

    return sendSuccess({
      res,
      data,
    });
  },

  getLessonDetails: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.GetLessonDetailsDto;

    const lessonData = await LessonService.getLessonDetails(dataSafe);

    return sendSuccess({
      res,
      data: lessonData,
    });
  },

  updateLesson: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.UpdateLessonDto;

    const updatedLesson = await LessonService.updateLesson(dataSafe);

    return sendSuccess({
      res,
      data: updatedLesson,
      message: "تم تحديث بيانات الحصة بنجاح وتفادي تداخل المواعيد.",
    });
  },

  changeLessonState: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.ChangeLessonStateDto;

    const updatedLesson = await LessonService.changeLessonState({ ...dataSafe });

    return sendSuccess({
      res,
      data: updatedLesson,
      message: `تمت تحديث حالة الحصة وإجراء التسووية المالية بنجاح.`,
    });
  },

  deleteLesson: async (req, res) => {
    const dataSafe = req.dataSafe as DTO.DeleteLessonDto;

    const deleteLesson = await LessonService.deleteLesson(dataSafe);

    return sendSuccess({
      res,
      data: deleteLesson,
    });
  },
}

export default LessonController;