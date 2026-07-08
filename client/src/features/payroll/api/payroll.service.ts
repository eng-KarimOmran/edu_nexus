import { axiosClient } from "@/lib/axios";
import * as Dto from "../payroll.dto";

import type {
    PaginatedResponse,
    SuccessfulResponse,
} from "@/types/axios";
import type { Payroll } from "../payroll.type";

type Entity = Payroll;

const payrollUrl = {
    base: `/admin/payroll`,

    byId: (payrollId: string) =>
        `/admin/payroll/${payrollId}`,

    byJobProfile: (jobProfileId: string) =>
        `/admin/payroll/${jobProfileId}`,
};

export const createPayroll = (data: Dto.CreatePayrollDto) => {
    const { body } = data;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        payrollUrl.base,
        body
    );
};

export const deletePayroll = (data: Dto.DeletePayrollDto) => {
    const { params } = data;
    const { payrollId } = params;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        payrollUrl.byId(payrollId)
    );
};

export const getAllPayrolls = (
    data: Dto.GetAllPayrollDto
) => {
    const { params, query } = data;
    const { jobProfileId } = params;
    const { limit, page } = query


    return axiosClient.get<PaginatedResponse<Entity>>(
        payrollUrl.byJobProfile(jobProfileId),
        {
            params: { limit, page },
        }
    );
};