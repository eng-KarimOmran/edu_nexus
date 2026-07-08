"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_service_1 = __importDefault(require("./course.service"));
const successResponse_1 = __importDefault(require("../../shared/utils/successResponse"));
const CourseController = {
    createCourse: async (req, res) => {
        const dataSafe = req.dataSafe;
        const course = await course_service_1.default.createCourse(dataSafe);
        return (0, successResponse_1.default)({
            res,
            statusCode: 201,
            data: course,
            message: "تم إنشاء الكورس بنجاح",
        });
    },
    updateCourse: async (req, res) => {
        const dataSafe = req.dataSafe;
        const course = await course_service_1.default.updateCourse(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: course,
            message: "تم تحديث الكورس بنجاح",
        });
    },
    deleteCourse: async (req, res) => {
        const dataSafe = req.dataSafe;
        await course_service_1.default.deleteCourse(dataSafe);
        return (0, successResponse_1.default)({
            res,
            message: "تم حذف الكورس بنجاح",
        });
    },
    getAllCourses: async (req, res) => {
        const dataSafe = req.dataSafe;
        const data = await course_service_1.default.getAllCourses(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data,
        });
    },
    getCourseDetails: async (req, res) => {
        const dataSafe = req.dataSafe;
        const course = await course_service_1.default.getCourseDetails(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: course,
        });
    },
    addCourseFeature: async (req, res) => {
        const dataSafe = req.dataSafe;
        const course = await course_service_1.default.addCourseFeature(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: course,
            message: "تم إضافة الميزة بنجاح",
        });
    },
    deleteCourseFeature: async (req, res) => {
        const dataSafe = req.dataSafe;
        const course = await course_service_1.default.deleteCourseFeature(dataSafe);
        return (0, successResponse_1.default)({
            res,
            data: course,
            message: "تم حذف الميزة بنجاح",
        });
    },
};
exports.default = CourseController;
