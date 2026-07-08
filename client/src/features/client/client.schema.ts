import z from "zod";

import {
    id,
    limit,
    phone,
    personName,
    clientSource,
    page,
} from "@/lib/common.validation";

export const CreateClientSchema = {
    body: z.object({
        academyId: id,
        name: personName,
        phone,
        source: clientSource,
    }),
};

export const UpdateClientSchema = {
    params: z.object({ clientId: id, academyId: id }),
    body: z.object({
        name: personName.optional(),
        phone: phone.optional(),
        source: clientSource.optional(),
    }),
};

export const DeleteClientSchema = {
    params: z.object({ clientId: id, academyId: id }),
};

export const GetAllClientsSchema = {
    params: z.object({ academyId: id }),
    query: z.object({
        page,
        limit,
        search: z.string().optional(),
        source: clientSource.optional(),
    }),
};

export const GetClientDetailsSchema = {
    params: z.object({ academyId: id }),
    query: z.object({
        phone: phone.optional(),
        clientId: id.optional()
    })
};