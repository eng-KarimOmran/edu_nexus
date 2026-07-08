import { Area } from "@/prisma/generated/client";
import { PaginatedResponse } from "../../shared/types/types";
import { AuthRequestHandler } from "../auth/auth.type";

import {
    CreateAreaDto,
    UpdateAreaDto,
    DeleteAreaDto,
    GetAllAreasDto,
    GetAreaDetailsDto,
} from "./area.dto";

export interface IAreaService {
    createArea(
        data: CreateAreaDto
    ): Promise<Area>;

    updateArea(
        data: UpdateAreaDto
    ): Promise<Area>;

    deleteArea(
        data: DeleteAreaDto
    ): Promise<Area>;

    getAllAreas(
        data: GetAllAreasDto
    ): Promise<PaginatedResponse<Area>>;

    getAreaDetails(
        data: GetAreaDetailsDto
    ): Promise<Area>;
}

export interface IAreaController {
    createArea: AuthRequestHandler;

    updateArea: AuthRequestHandler;

    deleteArea: AuthRequestHandler;

    getAllAreas: AuthRequestHandler;

    getAreaDetails: AuthRequestHandler;
}