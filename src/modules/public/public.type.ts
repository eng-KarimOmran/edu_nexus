import { RequestValidation } from './../../shared/middlewares/validate.middleware';
import { NextFunction, Response } from "express";
import { Academy, Area, Client, Course, JobProfile } from "@/prisma/generated/client";

import {
    GetAcademyDto,
    GetCoursesDto,
    GetAreasDto,
    GetClientDto,
    RegisterDto,
} from "./public.dto";

export type PublicRequestHandler = (
    req: RequestValidation,
    res: Response,
    next: NextFunction
) => Promise<Response>


export interface IPublicService {
    getAcademy(
        data: GetAcademyDto
    ): Promise<Academy>;

    getCourses(
        data: GetCoursesDto
    ): Promise<Course[]>;

    getAreas(
        data: GetAreasDto
    ): Promise<Area[]>;

    getClient(
        data: GetClientDto
    ): Promise<Client>;

    register(
        data: RegisterDto
    ): Promise<Client>;

    getCaptains(): Promise<JobProfile[]>
}

export interface IPublicController {
    getAcademy: PublicRequestHandler;

    getCourses: PublicRequestHandler;

    getAreas: PublicRequestHandler;

    getClient: PublicRequestHandler;

    getCaptains: PublicRequestHandler

    register: PublicRequestHandler;
}