import z from "zod";
import * as AreaSchema from "./area.schema";

export type CreateAreaDto = {
  body: z.infer<typeof AreaSchema.CreateAreaSchema.body>;
};

export type UpdateAreaDto = {
  params: z.infer<typeof AreaSchema.UpdateAreaSchema.params>;
  body: z.infer<typeof AreaSchema.UpdateAreaSchema.body>;
};

export type DeleteAreaDto = {
  params: z.infer<typeof AreaSchema.DeleteAreaSchema.params>;
};

export type GetAreaDetailsDto = {
  params: z.infer<typeof AreaSchema.GetAreaDetailsSchema.params>;
};

export type GetAllAreasDto = {
  query: z.infer<typeof AreaSchema.GetAllAreasSchema.query>;
};