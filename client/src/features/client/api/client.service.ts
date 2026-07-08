import { axiosClient } from "@/lib/axios";
import * as Dto from "../client.dto"
import type { PaginatedResponse, SuccessfulResponse } from "@/types/axios";
import type { Client, ClientDetails } from "../client.type";

type Entity = Client;
type EntityDetails = ClientDetails;

const clientsUrl = {
    base: (academyId: string) =>
        `/academies/${academyId}/client`,

    byId: (academyId: string, clientId: string) =>
        `/academies/${academyId}/client/${clientId}`,

    details: ({ academyId, phone, clientId }: { academyId: string, clientId?: string, phone?: string }) =>
        `/academies/${academyId}/client/details?${clientId ? `clientId=${clientId}` : phone ? `phone=${phone}` : ""}`
};

export const createClient = (data: Dto.CreateClientDto) => {
    const { academyId, ...body } = data.body

    return axiosClient.post<SuccessfulResponse<Entity>>(
        clientsUrl.base(academyId),
        body
    );
};

export const updateClient = (data: Dto.UpdateClientDto) => {
    const { params, body } = data;
    const { academyId, clientId } = params;

    return axiosClient.patch<SuccessfulResponse<Entity>>(
        clientsUrl.byId(academyId, clientId),
        body
    );
};

export const deleteClient = (data: Dto.DeleteClientDto) => {
    const { params } = data;
    const { academyId, clientId } = params;

    return axiosClient.delete<SuccessfulResponse<Client>>(
        clientsUrl.byId(academyId, clientId)
    );
};

export const getAllClients = (data: Dto.GetAllClientsDto) => {
    const { params, query } = data;
    const { academyId } = params;

    return axiosClient.get<PaginatedResponse<Entity>>(
        clientsUrl.base(academyId),
        {
            params: query
        }
    );
};

export const getClientDetails = (data: Dto.GetClientDetailsDto) => {
    const { params, query } = data;
    const { academyId } = params;
    const { clientId, phone } = query

    return axiosClient.get<SuccessfulResponse<EntityDetails>>(
        clientsUrl.details({ academyId, clientId, phone })
    );
};