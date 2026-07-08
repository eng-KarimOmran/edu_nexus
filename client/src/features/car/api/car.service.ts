import { axiosClient } from "@/lib/axios";

import type { PaginatedResponse, SuccessfulResponse } from "@/types/axios";

import * as Dto from "../car.dto";

import type { Car } from "../car.type";

type Entity = Car;

const carsUrl = {
    base: `/admin/car`,

    byId: (carId: string) =>
        `/admin/car/${carId}`,
};

export const createCar = (data: Dto.CreateDto) => {
    const { body } = data;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        carsUrl.base,
        body
    );
};

export const updateCar = (data: Dto.UpdateDto) => {
    const { params, body } = data;

    return axiosClient.patch<SuccessfulResponse<Entity>>(
        carsUrl.byId(params.carId),
        body
    );
};

export const deleteCar = (data: Dto.DeleteDto) => {
    const { params } = data;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        carsUrl.byId(params.carId)
    );
};

export const getAllCars = (data: Dto.GetAllDto) => {
    const { query } = data;

    return axiosClient.get<PaginatedResponse<Entity>>(
        carsUrl.base,
        {
            params: query,
        }
    );
};

export const getDetails = (data: Dto.GetDetailsDto) => {
    const { params } = data;

    return axiosClient.get<SuccessfulResponse<Entity>>(
        carsUrl.byId(params.carId)
    );
};