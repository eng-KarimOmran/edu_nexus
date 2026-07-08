import { useQuery } from "@tanstack/react-query";

import useAppQuery from "@/hooks/useAppQuery";

import type { Area } from "../area.type";

import type { GetAllAreasDto } from "../area.dto";

import {
    getAllAreas,
    getAreaDetails,
} from "./area.service";

import { queryKey } from "../area.constants";

export const useAreas = (query?: GetAllAreasDto["query"]) => {
    return useAppQuery<GetAllAreasDto, Area>({
        queryFn: (params) => getAllAreas({
            query: { ...query, ...params.query },
        }),

        queryKey: [...queryKey],

        keepPrevious: true,

        filters: ["supportType", "isActive"],

    });
};

export const useAreaDetails = (
    academyId?: string,
    areaId?: string
) => {
    return useQuery({
        queryKey: [...queryKey, academyId, areaId],

        queryFn: () => {
            if (!areaId)
                throw Error("بيانات المنطقة غير مكتملة");

            return getAreaDetails({
                params: {
                    areaId,
                },
            });
        },

        select: (res) => res.data.data,

        enabled: !!areaId,
    });
};