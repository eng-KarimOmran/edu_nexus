import { useQuery } from "@tanstack/react-query";

import useAppQuery from "@/hooks/useAppQuery";

import type { Car } from "../car.type";

import { queryKey } from "../car.constants";
import type { GetAllDto } from "../car.dto";
import { getAllCars, getDetails } from "./car.service";

export const useCars = (query?: GetAllDto["query"]) => {
    return useAppQuery<GetAllDto, Car>({
        queryFn: (params) => {
            return getAllCars({
                query: { ...query, ...params.query },
            });
        },

        queryKey: [...queryKey, query],

        keepPrevious: true,

        filters: ["gearType", "isActive"],
    });
};

export const useCarDetails = (
    carId?: string
) => {
    return useQuery({
        queryKey: [...queryKey, carId],

        queryFn: () => {
            if (!carId)
                throw Error("بيانات السيارة غير مكتملة");

            return getDetails({
                params: {
                    carId,
                },
            });
        },

        select: (res) => res.data.data,

        enabled: !!carId,
    });
};