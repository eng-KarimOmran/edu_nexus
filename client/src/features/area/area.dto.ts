import z from "zod";
import * as Schema from "./area.schema";

export type CreateAreaDto = {
    body: z.infer<typeof Schema.CreateAreaSchema.body>;
};

export type UpdateAreaDto = {
    params: z.infer<typeof Schema.UpdateAreaSchema.params>;
    body: z.infer<typeof Schema.UpdateAreaSchema.body>;
};

export type DeleteAreaDto = {
    params: z.infer<typeof Schema.DeleteAreaSchema.params>;
};

export type GetAllAreasDto = {
    query: z.infer<typeof Schema.GetAllAreasSchema.query>;
};

export type GetAreaDetailsDto = {
    params: z.infer<typeof Schema.GetAreaDetailsSchema.params>;
};