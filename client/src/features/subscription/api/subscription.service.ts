import { axiosClient } from "@/lib/axios";

import type {
    PaginatedResponse,
    SuccessfulResponse,
} from "@/types/axios";

import * as Dto from "../subscription.dto";

import type {
    Subscription,
    SubscriptionDetails,
} from "../subscription.type";

type Entity = Subscription;
type EntityDetails = SubscriptionDetails;

const subscriptionsUrl = {
    base: (academyId: string) =>
        `/academies/${academyId}/subscription`,

    byId: (academyId: string, subscriptionId: string) =>
        `/academies/${academyId}/subscription/${subscriptionId}`,

    cancel: (academyId: string, subscriptionId: string) =>
        `/academies/${academyId}/subscription/${subscriptionId}/cancel`,
};

export const createSubscription = (
    data: Dto.CreateSubscriptionDto
) => {
    const { params, body } = data;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        subscriptionsUrl.base(params.academyId),
        body
    );
};

export const getAllSubscriptions = (
    data: Dto.GetAllSubscriptionsDto
) => {
    const { params, query } = data;

    return axiosClient.get<PaginatedResponse<Entity>>(
        subscriptionsUrl.base(params.academyId),
        {
            params: query,
        }
    );
};

export const getSubscriptionDetails = (
    data: Dto.GetSubscriptionDetailsDto
) => {
    const { params } = data;

    return axiosClient.get<SuccessfulResponse<EntityDetails>>(
        subscriptionsUrl.byId(
            params.academyId,
            params.subscriptionId
        )
    );
};

export const deleteSubscription = (
    data: Dto.DeleteSubscriptionDto
) => {
    const { params } = data;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        subscriptionsUrl.byId(
            params.academyId,
            params.subscriptionId
        )
    );
};

export const cancelSubscription = (
    data: Dto.CancelSubscriptionDto
) => {
    const { params } = data;

    return axiosClient.patch<SuccessfulResponse<Entity>>(
        subscriptionsUrl.cancel(
            params.academyId,
            params.subscriptionId
        )
    );
};