import { axiosClient } from "@/lib/axios";

import type {
    PaginatedResponse,
    SuccessfulResponse,
} from "@/types/axios";

import * as Dto from "../area.dto";
import type { Area } from "../area.type";


type Entity = Area;

const areasUrl = {
    base: `/admin/area`,

    byId: (areaId: string) =>
        `/admin/area/${areaId}`,
};

export const createArea = (data: Dto.CreateAreaDto) => {
    const { body } = data;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        areasUrl.base,
        body
    );
};

export const updateArea = (data: Dto.UpdateAreaDto) => {
    const { params, body } = data;

    return axiosClient.patch<SuccessfulResponse<Entity>>(
        areasUrl.byId(params.areaId),
        body
    );
};

export const deleteArea = (data: Dto.DeleteAreaDto) => {
    const { params } = data;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        areasUrl.byId(params.areaId)
    );
};

export const getAllAreas = (data: Dto.GetAllAreasDto) => {
    const { query } = data;

    return axiosClient.get<PaginatedResponse<Entity>>(
        areasUrl.base,
        {
            params: query,
        }
    );
};

export const getAreaDetails = (
    data: Dto.GetAreaDetailsDto
) => {
    const { params } = data;

    return axiosClient.get<SuccessfulResponse<Entity>>(
        areasUrl.byId(params.areaId)
    );
};