"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lesson_service_1 = __importDefault(require("./lesson.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const LessonController = {
    createLesson: async (req, res) => {
        const dataSafe = req.dataSafe;
        const userId = req.userLogin.id;
        const lesson = await lesson_service_1.default.createLesson({ ...dataSafe, userId });
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: lesson,
            message: "تمت جدولة الحصة بنجاح.",
        });
    },
    getAllLessons: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await lesson_service_1.default.getAllLessons(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
        });
    },
    getLessonDetails: async (req, res) => {
        const dataSafe = req.dataSafe;
        const lessonData = await lesson_service_1.default.getLessonDetails(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: lessonData,
        });
    },
    updateLesson: async (req, res) => {
        const dataSafe = req.dataSafe;
        const updatedLesson = await lesson_service_1.default.updateLesson(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: updatedLesson,
            message: "تم تحديث بيانات الحصة بنجاح وتفادي تداخل المواعيد.",
        });
    },
    changeLessonState: async (req, res) => {
        const dataSafe = req.dataSafe;
        const updatedLesson = await lesson_service_1.default.changeLessonState({ ...dataSafe });
        return (0, successResponse_1.default)({
            res,
            data: updatedLesson,
            message: `تمت تحديث حالة الحصة وإجراء التسووية المالية بنجاح.`,
        });
    },
    deleteLesson: async (req, res) => {
        const dataSafe = req.dataSafe;
        const deleteLesson = await lesson_service_1.default.deleteLesson(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: deleteLesson,
        });
    },
};
exports.default = LessonController;
