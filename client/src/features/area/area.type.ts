import type { SupportType } from "@/types/enums";

export type Area = {
    id: string;
    name: string;
    supportType: SupportType;
    isActive: boolean;
    academyId: string;
    createdAt: string;
};