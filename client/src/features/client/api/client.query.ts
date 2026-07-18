import { useQuery } from "@tanstack/react-query";

import useAppQuery from "@/hooks/useAppQuery";

import type { Client } from "../client.type";

import type {
    GetAllClientsDto,
    GetClientDetailsDto,
} from "../client.dto";

import {
    getAllClients,
    getClientDetails,
} from "./client.service";

import { queryKey } from "../client.constants";

export const useClients = (academyId?: string) => {
    return useAppQuery<GetAllClientsDto, Client>({
        queryFn: (params) => {
            if (!academyId) throw Error("معرف الأكاديمية مطلوب");

            return getAllClients({
                params: {
                    academyId,
                },
                query: params.query,
            });
        },

        queryKey: [...queryKey, academyId],

        keepPrevious: true,

        filters: ["source"],

        enabled: !!academyId
    });
};

export const useClientDetails = (
    academyId?: string,
    query?: GetClientDetailsDto["query"]
) => {
    return useQuery({
        queryKey: [...queryKey, academyId, query],

        queryFn: () => {
            if (!academyId) throw Error("معرف الأكاديمية مطلوب");

            return getClientDetails({
                params: {
                    academyId,
                },
                query: query ?? {},
            });
        },

        select: (res) => res.data.data,

        enabled: !!query?.clientId || !!query?.phone
    });
};