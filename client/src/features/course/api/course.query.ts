import { useQuery } from "@tanstack/react-query";

import useAppQuery from "@/hooks/useAppQuery";

import type { Course } from "../course.type";

import type { GetAllCoursesDto } from "../course.dto";

import { getAllCourses, getCourseDetails } from "./course.service";

import { queryKey } from "../course.constants";

export const useCourses = ({ academyId, query }: { academyId?: string, query?: GetAllCoursesDto["query"] }) => {
    return useAppQuery<GetAllCoursesDto, Course>({
        queryFn: (params) => {
            if (!academyId) throw Error("معرف الأكاديمية مطلوب");

            return getAllCourses({
                params: {
                    academyId,
                },
                query: { ...query, ...params.query },

            });
        },

        queryKey: [...queryKey, academyId, query],

        keepPrevious: true,

        filters: ["isActive"],
    });
};

export const useCourseDetails = (academyId?: string, courseId?: string) => {
    return useQuery({
        queryKey: [...queryKey, academyId, courseId],

        queryFn: () => {
            if (!academyId || !courseId) throw Error("بيانات غير مكتملة");

            return getCourseDetails({
                params: {
                    academyId,
                    courseId,
                },
            });
        },

        select: (res) => res.data.data,

        enabled: !!courseId,
    });
};
