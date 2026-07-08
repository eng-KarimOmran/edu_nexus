import z from "zod";

import {
    id,
    phone,
    personName,
    price,
    url,
    transmission,
} from "../../shared/utils/common.validation";

export const GetAcademySchema = {
    params: z.object({
        academyId: id,
    }),
};

export const GetCoursesSchema = {
    params: z.object({
        academyId: id,
    }),
};

export const GetAreasSchema = {
    params: z.object({
        academyId: id,
    }),
};

export const GetClientSchema = {
    params: z.object({
        academyId: id,
        clientId: id,
    }),
};

export const RegisterSchema = {
    params: z.object({
        academyId: id,
    }),

    body: z.object({
        client: z.object({
            name: personName,
            phone,
        }),

        subscription: z.object({
            courseId: id,
            areaId: id,
            trainingTypeAtRegistration: transmission,
        }),

        payment: z.object({
            amount: price,
            image: z.object({
                publicId: z.string().min(1, "معرف الصورة مطلوب"),
                imageUrl: url,
            }),
        }).optional(),
    }),
};