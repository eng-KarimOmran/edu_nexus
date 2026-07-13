import { useQuery } from "@tanstack/react-query";

import useAppQuery from "@/hooks/useAppQuery";
import type { JobProfile } from "../jobProfile.type";
import { getAllJobProfiles, getJobProfileDetails } from "./jobProfile.service";
import { queryKey } from "../jobProfile.constants";
import type { GetAllJobProfilesDto } from "../jobProfile.dto";

export const useJobProfiles = (query?: GetAllJobProfilesDto["query"]) => {
    return useAppQuery<GetAllJobProfilesDto, JobProfile>({
        queryFn: (params) => {
            return getAllJobProfiles({
                query: { ...query, ...params.query },
            })
        },
        queryKey: [...queryKey, query?.supportType],
        keepPrevious: true,
        filters: ["isActive", "jobProfileType", "supportType"],
    });
};

export const useJobProfileDetails = (
    jobProfileId?: string
) => {
    return useQuery({
        queryKey: [...queryKey, jobProfileId],
        queryFn: () => {
            if (!jobProfileId) throw Error("معرف الوظيفة مطلوب");

            return getJobProfileDetails({
                params: {
                    jobProfileId,
                },
            });
        },
        select: (res) => res.data.data,
        enabled: !!jobProfileId,
    });
};