import { NextFunction, Response } from "express";
import { JobProfile } from "@/prisma/generated/client";
import { PaginatedResponse } from "../../shared/types/types";
import { RequestAcademy } from "../academy/academy.type";

import {
    CreateJobProfileDto,
    UpdateJobProfileDto,
    DeleteJobProfileDto,
    GetAllJobProfilesDto,
    GetJobProfileDetailsDto,
} from "./jobProfile.dto";
import { AuthRequestHandler } from "../auth/auth.type";

export interface IJobProfileService {
    createJobProfile(
        data: CreateJobProfileDto
    ): Promise<JobProfile>;

    updateJobProfile(
        data: UpdateJobProfileDto,
    ): Promise<JobProfile>;

    deleteJobProfile(
        data: DeleteJobProfileDto
    ): Promise<JobProfile>;

    getAllJobProfiles(
        data: GetAllJobProfilesDto
    ): Promise<PaginatedResponse<JobProfile>>;

    getJobProfileDetails(
        data: GetJobProfileDetailsDto
    ): Promise<JobProfile>;
}


export interface IJobProfileController {
    createJobProfile: AuthRequestHandler;

    updateJobProfile: AuthRequestHandler;

    deleteJobProfile: AuthRequestHandler;

    getAllJobProfiles: AuthRequestHandler;

    getJobProfileDetails: AuthRequestHandler;
}

export interface RequestJobProfile extends RequestAcademy {
    jobProfile?: JobProfile
}

export type JobProfileRequestHandler = (
    req: RequestJobProfile,
    res: Response,
    next: NextFunction
) => Promise<Response>