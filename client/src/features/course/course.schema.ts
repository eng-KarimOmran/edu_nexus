import z from "zod";

import {
    id,
    limit,
    positiveNumber,
    entityName,
    boolean,
    price,
    booleanQuery,
    page,
} from "@/lib/common.validation";

export const CreateCourseSchema = {
    params: z.object({
        academyId: id,
    }),

    body: z
        .object({
            name: entityName,
            description: z.string(),

            priceOriginal: price,
            priceDiscounted: price,

            requiredInitialDeposit: price,

            sessionsBeforeFullPayment: price,

            sessionDurationMinutes: positiveNumber,

            totalSessions: positiveNumber,

            featuredReason: z.string().optional(),
        })
        .refine(
            (data) => data.priceOriginal >= data.priceDiscounted,
            {
                message: "السعر بعد الخصم يجب أن يكون أقل من أو يساوي السعر الأصلي",
                path: ["priceDiscounted"],
            }
        ),
};

export const UpdateCourseSchema = {
    params: z.object({
        academyId: id,
        courseId: id,
    }),

    body: z
        .object({
            name: entityName.optional(),

            description: z.string().optional(),

            priceOriginal: price.optional(),

            priceDiscounted: price.optional(),

            requiredInitialDeposit: price.optional(),

            sessionsBeforeFullPayment: price.optional(),

            sessionDurationMinutes: positiveNumber.optional(),

            totalSessions: positiveNumber.optional(),

            featuredReason: z.string().optional(),

            isActive: boolean.optional(),
        })
        .refine(
            (data) => {
                if (
                    data.priceOriginal !== undefined &&
                    data.priceDiscounted !== undefined
                ) {
                    return data.priceOriginal >= data.priceDiscounted;
                }

                return true;
            },
            {
                message: "السعر بعد الخصم يجب أن يكون أقل من أو يساوي السعر الأصلي",
                path: ["priceDiscounted"],
            }
        ),
};

export const DeleteCourseSchema = {
    params: z.object({
        academyId: id,
        courseId: id,
    }),
};

export const GetAllCoursesSchema = {
    params: z.object({
        academyId: id,
    }),

    query: z.object({
        page,
        limit,

        search: z.string().optional(),

        isActive: booleanQuery.optional(),
    }),
};

export const GetCourseDetailsSchema = {
    params: z.object({
        academyId: id,
        courseId: id,
    }),
};

export const AddCourseFeatureSchema = {
    params: z.object({
        academyId: id,
        courseId: id,
    }),

    body: z.object({
        text: z.string(),
    }),
};

export const DeleteCourseFeatureSchema = {
    params: z.object({
        academyId: id,
        courseId: id,
        featureId: id,
    }),
};