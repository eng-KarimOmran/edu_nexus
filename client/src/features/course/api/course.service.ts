import { axiosClient } from "@/lib/axios";

import type { PaginatedResponse, SuccessfulResponse } from "@/types/axios";

import * as Dto from "../course.dto";

import type {
    Course,
    CourseDetails,
    CourseFeature,
} from "../course.type";

type Entity = Course;
type EntityDetails = CourseDetails;

const coursesUrl = {
    base: (academyId: string) =>
        `/academies/${academyId}/course`,
    
    byId: (academyId: string, courseId: string) =>
        `/academies/${academyId}/course/${courseId}`,

    feature: (academyId: string, courseId: string) =>
        `/academies/${academyId}/course/${courseId}/features`,

    featureById: (
        academyId: string,
        courseId: string,
        featureId: string
    ) =>
        `/academies/${academyId}/course/${courseId}/features/${featureId}`,
};

export const createCourse = (data: Dto.CreateCourseDto) => {
    const { params, body } = data;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        coursesUrl.base(params.academyId),
        body
    );
};

export const updateCourse = (data: Dto.UpdateCourseDto) => {
    const { params, body } = data;

    return axiosClient.patch<SuccessfulResponse<Entity>>(
        coursesUrl.byId(params.academyId, params.courseId),
        body
    );
};

export const deleteCourse = (data: Dto.DeleteCourseDto) => {
    const { params } = data;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        coursesUrl.byId(params.academyId, params.courseId)
    );
};

export const getAllCourses = (data: Dto.GetAllCoursesDto) => {
    const { params, query } = data;

    return axiosClient.get<PaginatedResponse<Entity>>(
        coursesUrl.base(params.academyId),
        {
            params: query,
        }
    );
};

export const getCourseDetails = (data: Dto.GetCourseDetailsDto) => {
    const { params } = data;

    return axiosClient.get<SuccessfulResponse<EntityDetails>>(
        coursesUrl.byId(params.academyId, params.courseId)
    );
};

export const addCourseFeature = (
    data: Dto.AddCourseFeatureDto
) => {
    const { params, body } = data;

    return axiosClient.post<SuccessfulResponse<CourseFeature>>(
        coursesUrl.feature(params.academyId, params.courseId),
        body
    );
};

export const deleteCourseFeature = (
    data: Dto.DeleteCourseFeatureDto
) => {
    const { params } = data;

    return axiosClient.delete<SuccessfulResponse<CourseFeature>>(
        coursesUrl.featureById(
            params.academyId,
            params.courseId,
            params.featureId
        )
    );
};