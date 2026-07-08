"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../lib/prisma");
const ApiError_1 = __importDefault(require("../../shared/utils/ApiError"));
const Pagination_1 = require("../../shared/utils/Pagination");
const course_utils_1 = require("./course.utils");
const CourseService = {
    async createCourse({ params, body }) {
        const { academyId } = params;
        const course = await prisma_1.prisma.course.findUnique({ where: { academyId_name: { academyId, name: body.name } } });
        if (course)
            throw ApiError_1.default.Conflict("NAME_ALREADY_EXISTS");
        return prisma_1.prisma.course.create({
            data: {
                academy: {
                    connect: {
                        id: academyId,
                    },
                },
                ...body,
            },
        });
    },
    async updateCourse({ params, body }) {
        const { academyId, courseId } = params;
        const course = await prisma_1.prisma.course.findFirst({
            where: {
                id: courseId,
                academyId,
            },
        });
        if (!course)
            throw ApiError_1.default.NotFound("Course");
        if (body.name && body.name !== course.name) {
            const courseName = await prisma_1.prisma.course.findUnique({ where: { academyId_name: { academyId, name: body.name } } });
            if (courseName)
                throw ApiError_1.default.Conflict("NAME_ALREADY_EXISTS");
        }
        return prisma_1.prisma.course.update({
            where: {
                id: courseId,
            },
            data: body,
            include: {
                features: true,
            },
        });
    },
    async deleteCourse({ params }) {
        const { academyId, courseId } = params;
        const course = await prisma_1.prisma.course.findFirst({
            where: {
                id: courseId,
                academyId,
            },
        });
        if (!course)
            throw ApiError_1.default.NotFound("Course");
        return prisma_1.prisma.course.delete({
            where: {
                id: courseId,
            },
        });
    },
    async getAllCourses({ params, query }) {
        const { academyId } = params;
        const { page, limit, search, isActive } = query;
        const where = (0, course_utils_1.buildCourseWhere)({
            academyId,
            search,
            isActive,
        });
        const { take, skip } = (0, Pagination_1.buildPagination)({
            page,
            limit,
        });
        const [items, count] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.course.findMany({
                where,
                skip,
                take,
                orderBy: course_utils_1.orderBy,
            }),
            prisma_1.prisma.course.count({
                where,
            }),
        ]);
        return {
            items,
            pagination: (0, Pagination_1.buildPaginationMeta)({
                count,
                page,
                limit,
            }),
        };
    },
    async getCourseDetails({ params }) {
        const { academyId, courseId } = params;
        const course = await prisma_1.prisma.course.findFirst({
            where: {
                id: courseId,
                academyId,
            },
            include: {
                features: true,
            },
        });
        if (!course)
            throw ApiError_1.default.NotFound("Course");
        return course;
    },
    async addCourseFeature({ params, body }) {
        const { academyId, courseId } = params;
        const course = await prisma_1.prisma.course.findFirst({
            where: {
                id: courseId,
                academyId,
            },
        });
        if (!course)
            throw ApiError_1.default.NotFound("Course");
        return prisma_1.prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                features: {
                    create: {
                        feature: body.text,
                    },
                },
            },
            include: {
                features: true,
            },
        });
    },
    async deleteCourseFeature({ params }) {
        const { academyId, courseId, featureId } = params;
        const feature = await prisma_1.prisma.courseFeature.findFirst({
            where: {
                id: featureId,
                courseId,
                course: { academyId }
            },
        });
        if (!feature)
            throw ApiError_1.default.NotFound("CourseFeature");
        await prisma_1.prisma.courseFeature.delete({
            where: {
                id: featureId,
            }
        });
        const course = await prisma_1.prisma.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                features: true
            }
        });
        if (!course)
            throw ApiError_1.default.NotFound("Course");
        return course;
    },
};
exports.default = CourseService;
