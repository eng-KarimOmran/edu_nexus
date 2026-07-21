import { JobProfileSelectType } from './employee.select';
import { Car, Client, Lesson, User, Wallet } from "@/prisma/generated/client";
import { JobProfileRequestHandler } from "../jobProfile/jobProfile.type";
import * as Dto from "./employee.dto"
import { UserGetPayload } from '@/prisma/generated/models';

export type EmployeeWithLessons = UserGetPayload<{
    select: {
        id: true;
        name: true;
        phone: true;
        jobProfile: {
            select: {
                id: true;
                lessons: {
                    select: {
                        id: true;
                        expectedPaymentAmount: true;
                        lessonStatus: true;
                        startTime: true;
                        walletMovement: {
                            select: {
                                id: true;
                                amount: true;
                                paymentMethod: true;
                            };
                        };
                        academy: {
                            select: {
                                id: true;
                                name: true;
                            };
                        };
                        area: {
                            select: {
                                id: true;
                                name: true;
                            };
                        };
                        car: {
                            select: {
                                id: true;
                                modelName: true;
                                plateNumber: true;
                            };
                        };
                        client: {
                            select: {
                                id: true;
                                name: true;
                                phone: true;
                            };
                        };
                    };
                };
            };
        };
    };
}>;

export interface IEmployeeService {
    getJobProfileDebts(data: { jobProfileId: string }): Promise<Wallet[]>;

    getAllLessons(data: Dto.GetAllLessonsDto): Promise<Lesson[]>;

    getClient(data: Dto.GetClient): Promise<Client | null>;

    getEmployeesWithDebts(): Promise<JobProfileSelectType[]>

    getAllCarAndLesson(data: Dto.GetAllCarAndLessonDto): Promise<Car[]>;

    getAllEmployeesWithLesson(data: Dto.GetAllEmployeesWithLessonDto): Promise<EmployeeWithLessons[]>
}


export interface IEmployeeController {
    getJobProfileDebts: JobProfileRequestHandler;
    getAllLessons: JobProfileRequestHandler;
    getClient: JobProfileRequestHandler;
    getEmployeesWithDebts: JobProfileRequestHandler;
    getAllCarAndLesson: JobProfileRequestHandler;
    getAllEmployeesWithLesson: JobProfileRequestHandler
}