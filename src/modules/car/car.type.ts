import { Car } from "@/prisma/generated/client";
import { PaginatedResponse } from "../../shared/types/types";
import { AuthRequestHandler } from "../auth/auth.type";

import {
    CreateDto,
    UpdateDto,
    DeleteDto,
    GetAllDto,
    GetDetailsDto,
} from "./car.dto";

export interface ICarService {
    createCar(
        data: CreateDto
    ): Promise<Car>;

    updateCar(
        data: UpdateDto
    ): Promise<Car>;

    deleteCar(
        data: DeleteDto
    ): Promise<Car>;

    getAllCars(
        data: GetAllDto
    ): Promise<PaginatedResponse<Car>>;

    getDetails(
        data: GetDetailsDto
    ): Promise<Car>;
}

export interface ICarController {
    createCar: AuthRequestHandler;

    updateCar: AuthRequestHandler;

    deleteCar: AuthRequestHandler;

    getAllCars: AuthRequestHandler;

    getDetails: AuthRequestHandler;
}