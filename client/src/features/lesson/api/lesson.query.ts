import { useQuery } from "@tanstack/react-query";

import useAppQuery from "@/hooks/useAppQuery";

import {
    getAllLessons,
    getLessonDetails,
} from "./lesson.service";

import type {
    GetAllLessonsDto,

} from "../lesson.dto";

import type { Lesson } from "../lesson.type";

import { queryKey } from "../lesson.constants";

export const useLessons = (academyId?: string) => {
    return useAppQuery<GetAllLessonsDto, Lesson>({
        queryFn: (params) => {
            if (!academyId)
                throw Error("معرف الأكاديمية مطلوب");

            return getAllLessons({
                params: {
                    academyId,
                },
                query: params.query,
            });
        },

        queryKey: [...queryKey, academyId],

        keepPrevious: true,
    });
};

export const useLessonDetails = (
    academyId?: string,
    lessonId?: string
) => {
    return useQuery({
        queryKey: [...queryKey, academyId, lessonId],

        queryFn: () => {
            if (!academyId || !lessonId)
                throw Error("البيانات غير مكتملة");

            return getLessonDetails({
                params: {
                    academyId,
                    lessonId,
                },
            });
        },

        select: (res) => res.data.data,

        enabled: !!lessonId,
    });
};