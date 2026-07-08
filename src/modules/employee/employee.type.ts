import { JobProfileSelectType } from './employee.select';
import { Client, Lesson, Wallet } from "@/prisma/generated/client";
import { JobProfileRequestHandler } from "../jobProfile/jobProfile.type";
import * as Dto from "./employee.dto"

export interface IEmployeeService {
    getJobProfileDebts(data: { jobProfileId: string }): Promise<Wallet[]>;

    getAllLessons(data: Dto.GetAllLessonsDto): Promise<Lesson[]>;

    getClient(data: Dto.GetClient): Promise<Client | null>;

    getEmployeesWithDebts(): Promise<JobProfileSelectType[]>
}


export interface IEmployeeController {
    getJobProfileDebts: JobProfileRequestHandler;
    getAllLessons: JobProfileRequestHandler;
    getClient: JobProfileRequestHandler;
    getEmployeesWithDebts: JobProfileRequestHandler;
}