import z from "zod";
import * as Schema from "./employee.schema"

export type GetAllLessonsDto = {
    query: z.infer<
        typeof Schema.getAllLessonsSchema.query
    >;
}

export type GetClient = {
    query: z.infer<
        typeof Schema.getClientSchema.query
    >;
}