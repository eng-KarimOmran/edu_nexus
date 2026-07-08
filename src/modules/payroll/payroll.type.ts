import { Payroll } from "@/prisma/generated/client";
import * as DTO from "./payroll.dto";
import { JobProfileRequestHandler } from "../jobProfile/jobProfile.type";
import { PaginatedResponse } from "../../shared/types/types";

export interface IPayrollService {
    createPayroll(
        data: DTO.CreatePayrollDto
    ): Promise<Payroll>;

    deletePayroll(
        data: DTO.DeletePayrollDto
    ): Promise<Payroll>;

    getAllPayroll(data: DTO.GetAllPayrollDto): Promise<PaginatedResponse<Payroll>>
}

export interface IPayrollController {
    createPayroll: JobProfileRequestHandler;

    deletePayroll: JobProfileRequestHandler;

    getAllPayroll: JobProfileRequestHandler;
}