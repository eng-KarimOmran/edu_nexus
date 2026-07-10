import type { Academy } from "../academy/academy.type";
import type { JobProfile } from "../jobProfile/jobProfile.type";

export interface User {
    id: string;
    name: string;
    phone: string;
    isActive: boolean;
    email: string | null
    isPasswordChanged: boolean;
    isAdmin: boolean
    createdAt: string;
}

export interface UserWithAcademy extends User {
    academies: Academy[]
}

export interface UserProfile extends UserWithAcademy {
    jobProfile?: JobProfile
}