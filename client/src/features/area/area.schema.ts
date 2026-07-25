import {
    id,
    limit,
    boolean,
    entityName,
    booleanQuery,
    page,
    supportType,
    number,
} from "@/lib/common.validation";

import z from "zod";

export const CreateAreaSchema = {
    body: z.object({
        name: entityName,
        supportType,
        travelDurationInMinutes: number
    }),
};

export const UpdateAreaSchema = {
    params: z.object({
        areaId: id,
    }),
    body: z.object({
        name: entityName.optional(),
        supportType: supportType.optional(),
        isActive: boolean.optional(),
        travelDurationInMinutes: number.optional()
    }),
};

export const GetAllAreasSchema = {
    query: z.object({
        page,
        limit,
        search: z.string().optional(),
        isActive: booleanQuery.optional(),
        supportType: supportType.optional(),
    }),
};

export const GetAreaDetailsSchema = {
    params: z.object({
        areaId: id,
    }),
};

export const DeleteAreaSchema = {
    params: z.object({
        areaId: id,
    }),
};