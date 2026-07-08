import { z } from "zod";
import { id, limit, number, page, price } from "../../lib/common.validation";

export const createPayrollSchema = {
    body: z.object({
        jobProfileId: id,
        academyId: id,
        baseSalary: price,
        subscriptionsAmount: price,
        bonusAmount: number,
        lessonsAmount: price,
        deductions: price,
    }),
};

export const deletePayrollSchema = {
    params: z.object({
        payrollId: id,
    }),
};

export const getAllSchemaPayroll = {
    params: z.object({
        jobProfileId: id,
    }),
    query: z.object({
        page,
        limit,
    }),
};