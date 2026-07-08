import z from "zod";
import * as Schema from "./payroll.schema";

export type CreatePayrollDto = {
    body: z.infer<typeof Schema.createPayrollSchema.body>;
};

export type DeletePayrollDto = {
    params: z.infer<typeof Schema.deletePayrollSchema.params>;
};

export type GetAllPayrollDto = {
    params: z.infer<typeof Schema.getAllSchemaPayroll.params>;
    query: z.infer<typeof Schema.getAllSchemaPayroll.query>;
};