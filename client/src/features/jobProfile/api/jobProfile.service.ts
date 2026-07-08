import { axiosClient } from "@/lib/axios";
import * as Dto from "../jobProfile.dto";

import type {
    PaginatedResponse,
    SuccessfulResponse,
} from "@/types/axios";
import type { JobProfile, JobProfileDetails } from "../jobProfile.type";

type Entity = JobProfile;
type EntityDetails = JobProfileDetails;

const jobProfileUrl = {
    base: `/admin/job-profile`,

    byId: (jobProfileId: string) =>
        `/admin/job-profile/${jobProfileId}`,
};

export const createJobProfile = (data: Dto.CreateJobProfileDto) => {
    const { body } = data;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        jobProfileUrl.base,
        body
    );
};

export const updateJobProfile = (data: Dto.UpdateJobProfileDto) => {
    const { params, body } = data;
    const { jobProfileId } = params;

    return axiosClient.patch<SuccessfulResponse<Entity>>(
        jobProfileUrl.byId(jobProfileId),
        body
    );
};

export const deleteJobProfile = (data: Dto.DeleteJobProfileDto) => {
    const { params } = data;
    const { jobProfileId } = params;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        jobProfileUrl.byId(jobProfileId)
    );
};

export const getAllJobProfiles = (
    data: Dto.GetAllJobProfilesDto
) => {
    const { query } = data;

    return axiosClient.get<PaginatedResponse<Entity>>(
        jobProfileUrl.base,
        {
            params: query,
        }
    );
};

export const getJobProfileDetails = (
    data: Dto.GetJobProfileDetailsDto
) => {
    const { params } = data;
    const { jobProfileId } = params;

    return axiosClient.get<SuccessfulResponse<EntityDetails>>(
        jobProfileUrl.byId(jobProfileId)
    );
};