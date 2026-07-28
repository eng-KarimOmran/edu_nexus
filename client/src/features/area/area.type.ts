import type { SupportType } from "@/types/enums";

export type Area = {
    id: string;
    name: string;
    supportType: SupportType;
    travelDurationInMinutes: number
    isActive: boolean;
    createdAt: string;
};