import z from "zod";

import {
  id,
  limit,
  phone,
  personName,
  clientSource,
  page,
} from "../../shared/utils/common.validation";

export const CreateClientSchema = {
  params: z.object({ academyId: id }),
  body: z.object({
    name: personName,
    phone,
    source: clientSource.optional(),
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