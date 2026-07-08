import z from "zod";
import * as Schema from "./client.schema";

export type CreateClientDto = {
  params: z.infer<typeof Schema.CreateClientSchema.params>;
  body: z.infer<typeof Schema.CreateClientSchema.body>;
};

export type UpdateClientDto = {
  params: z.infer<typeof Schema.UpdateClientSchema.params>;
  body: z.infer<typeof Schema.UpdateClientSchema.body>;
};

export type DeleteClientDto = {
  params: z.infer<typeof Schema.DeleteClientSchema.params>;
};

export type GetAllClientsDto = {
  params: z.infer<typeof Schema.GetAllClientsSchema.params>;
  query: z.infer<typeof Schema.GetAllClientsSchema.query>;
};

export type GetClientDetailsDto = {
  params: z.infer<typeof Schema.GetClientDetailsSchema.params>;
  query: z.infer<typeof Schema.GetClientDetailsSchema.query>;
};