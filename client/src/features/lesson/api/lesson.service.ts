import { axiosClient } from "@/lib/axios";

import type {
    PaginatedResponse,
    SuccessfulResponse,
} from "@/types/axios";

import * as Dto from "../lesson.dto";

import type { Lesson } from "../lesson.type";

type Entity = Lesson;

const lessonUrl = {
    base: (academyId: string) =>
        `/academies/${academyId}/lesson`,

    byId: (academyId: string, lessonId: string) =>
        `/academies/${academyId}/lesson/${lessonId}`,

    changeStatus: (academyId: string, lessonId: string) =>
        `/academies/${academyId}/lesson/${lessonId}/status`,
};

export const createLesson = (data: Dto.CreateLessonDto) => {
    const { params, body } = data;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        lessonUrl.base(params.academyId),
        body
    );
};

export const updateLesson = (data: Dto.UpdateLessonDto) => {
    const { params, body } = data;

    return axiosClient.patch<SuccessfulResponse<Entity>>(
        lessonUrl.byId(params.academyId, params.lessonId),
        body
    );
};

export const getAllLessons = (data: Dto.GetAllLessonsDto) => {
    const { params, query } = data;

    return axiosClient.get<PaginatedResponse<Entity>>(
        lessonUrl.base(params.academyId),
        {
            params: query,
        }
    );
};

export const getLessonDetails = (
    data: Dto.GetLessonDetailsDto
) => {
    const { params } = data;

    return axiosClient.get<SuccessfulResponse<Entity>>(
        lessonUrl.byId(params.academyId, params.lessonId)
    );
};

export const changeLessonState = (
    data: Dto.ChangeLessonStateDto
) => {
    const { params, body } = data;
    return axiosClient.patch<SuccessfulResponse<Entity>>(
        lessonUrl.changeStatus(params.academyId, params.lessonId),
        body
    );
};