import z from "zod";
import { date, id, lessonStatus, limit, page } from "../../shared/utils/common.validation";

export const getAllLessonsSchema = {
    query: z.object({
        lessonStatus: lessonStatus.optional(),
        startTime: date,
        endTime: date,
        jobProfileId: id.optional()
    })
}


export const getClientSchema = {
    query: z.object({
        search: z.string().min(11),
    })
}

export const GetAllCarAndLessonSchema = {
    query: z.object({
        startTime: date,
        endTime: date,
    }),
};

export const GetAllEmployeesWithLessonSchema = {
    query: z.object({
        startTime: date,
        endTime: date,
    }),
}

export const getAreaWithSubscriptionSchema = {
    query: z.object({
        areaId: id,
        page,
        limit,
    }),
}