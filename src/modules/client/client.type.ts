import { Client } from "@/prisma/generated/client";
import { TransactionClient } from "@/prisma/generated/internal/prismaNamespace";
import { ClientGetPayload } from "@/prisma/generated/models";
import { PaginatedResponse } from "../../shared/types/types";
import { AcademyRequestHandler } from "../academy/academy.type";

import {
    CreateClientDto,
    DeleteClientDto,
    GetAllClientsDto,
    GetClientDetailsDto,
    UpdateClientDto,
} from "./client.dto";

type ClientDetails = {
    currentClient: ClientGetPayload<{ include: { subscriptions: true } }>
    otherFiles: Client[]
}

export interface IClientService {
    createClient(data: CreateClientDto & { tx?: TransactionClient }): Promise<Client>;

    updateClient(data: UpdateClientDto): Promise<Client>;

    deleteClient(data: DeleteClientDto & {tx?:TransactionClient}): Promise<Client>;

    getAllClients(data: GetAllClientsDto): Promise<PaginatedResponse<Client>>;

    getClientDetails(data: GetClientDetailsDto): Promise<ClientDetails>;
}

export interface IClientController {
    create: AcademyRequestHandler;

    update: AcademyRequestHandler;

    delete: AcademyRequestHandler;

    getDetails: AcademyRequestHandler;

    getAll: AcademyRequestHandler;
}