import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import {
  buildPagination,
  buildPaginationMeta,
} from "../../shared/utils/Pagination";
import { buildCourseWhere, orderBy } from "./course.utils";
import { ICourseService } from "./course.type";

const CourseService: ICourseService = {
  async createCourse({ params, body }) {
    const { academyId } = params;

    const course = await prisma.course.findUnique({ where: { academyId_name: { academyId, name: body.name } } })
    if (course) throw ApiError.Conflict("NAME_ALREADY_EXISTS")

    return prisma.course.create({
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

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        academyId,
      },
    });

    if (!course) throw ApiError.NotFound("Course");

    if (body.name && body.name !== course.name) {
      const courseName = await prisma.course.findUnique({ where: { academyId_name: { academyId, name: body.name } } })
      if (courseName) throw ApiError.Conflict("NAME_ALREADY_EXISTS")
    }

    return prisma.course.update({
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

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        academyId,
      },
    });

    if (!course) throw ApiError.NotFound("Course");

    return prisma.course.delete({
      where: {
        id: courseId,
      },
    });
  },

  async getAllCourses({ params, query }) {
    const { academyId } = params;
    const { page, limit, search, isActive } = query;

    const where = buildCourseWhere({
      academyId,
      search,
      isActive,
    });

    const { take, skip } = buildPagination({
      page,
      limit,
    });

    const [items, count] = await prisma.$transaction([
      prisma.course.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      prisma.course.count({
        where,
      }),
    ]);

    return {
      items,
      pagination: buildPaginationMeta({
        count,
        page,
        limit,
      }),
    };
  },

  async getCourseDetails({ params }) {
    const { academyId, courseId } = params;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        academyId,
      },
      include: {
        features: true,
      },
    });

    if (!course) throw ApiError.NotFound("Course");

    return course;
  },

  async addCourseFeature({ params, body }) {
    const { academyId, courseId } = params;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        academyId,
      },
    });

    if (!course) throw ApiError.NotFound("Course");

    return prisma.course.update({
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

    const feature = await prisma.courseFeature.findFirst({
      where: {
        id: featureId,
        courseId,
        course: { academyId }
      },
    });

    if (!feature) throw ApiError.NotFound("CourseFeature");

    await prisma.courseFeature.delete({
      where: {
        id: featureId,
      }
    })

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        features: true
      }
    });

    if (!course) throw ApiError.NotFound("Course");

    return course
  },
};

export default CourseService;