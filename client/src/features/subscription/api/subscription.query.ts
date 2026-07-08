import { useQuery } from "@tanstack/react-query";

import useAppQuery from "@/hooks/useAppQuery";

import type { Subscription } from "../subscription.type";

import type {
    GetAllSubscriptionsDto,
} from "../subscription.dto";

import {
    getAllSubscriptions,
    getSubscriptionDetails,
} from "./subscription.service";

import { queryKey } from "../subscription.constants";

export const useSubscriptions = (
    academyId?: string
) => {
    return useAppQuery<
        GetAllSubscriptionsDto,
        Subscription
    >({
        queryFn: (params) => {
            if (!academyId)
                throw Error("معرف الأكاديمية مطلوب");

            return getAllSubscriptions({
                params: {
                    academyId,
                },
                query: params.query,
            });
        },

        queryKey: [...queryKey, academyId],

        keepPrevious: true,

        filters: ["subscriptionStatus"],
    });
};

export const useSubscriptionDetails = (
    academyId?: string,
    subscriptionId?: string
) => {
    return useQuery({
        queryKey: [
            ...queryKey,
            academyId,
            subscriptionId,
        ],

        queryFn: () => {
            if (!academyId || !subscriptionId)
                throw Error("بيانات غير مكتملة");

            return getSubscriptionDetails({
                params: {
                    academyId,
                    subscriptionId,
                },
            });
        },

        select: (res) => res.data.data,

        enabled: !!subscriptionId,
    });
};