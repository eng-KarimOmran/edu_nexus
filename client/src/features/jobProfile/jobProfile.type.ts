import type { JobProfileType, SupportType } from "@/types/enums";
import type { User } from "../user/user.type";

export interface JobProfile {
    id: string;
    userId: string;
    jobProfileType: JobProfileType;
    isActive: boolean;
    baseSalary: number;
    lessonPrice: number;
    supportType: SupportType | null;
    targetCount: number;
    bonusAmount: number;
    createdAt: string;
    user: User
}


export interface AcademySummary {
    academyId: string;
    academyName: string;
    wallet: {
        id: string
        balance: number,
    } | null
    lessonCount: number;
    subscriptionCount: number;
}

export interface JobProfileDetails extends JobProfile {
    academySummaries: AcademySummary[];
}