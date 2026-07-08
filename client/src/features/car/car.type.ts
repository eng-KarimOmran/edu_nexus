import type { Transmission } from "@/types/enums";

export type Car = {
    id: string;
    modelName: string;
    plateNumber: string;
    gearType: Transmission;
    carSessionPrice: number;
    isActive: boolean;
    academyId: string;
    createdAt: string;
};