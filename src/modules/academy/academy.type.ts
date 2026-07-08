import { PaginatedResponse } from './../../shared/types/types';
import { AcademyGetPayload, TransactionClient } from "@/prisma/generated/internal/prismaNamespace";
import * as DTO from "./academy.dto";
import { Academy, User } from '@/prisma/generated/client';
import { AuthRequestHandler, RequestAuth } from '../auth/auth.type';
import { Response, NextFunction } from 'express';

type SafeUser = Omit<User, "password" | "logoutAt">;



export type AcademyWithFullRelations =
    AcademyGetPayload<{
        include: {
            academyPhones: true,
            addresses: true,
            owners: true,
            paymentLinks: true,
            socialMedia: true,
        };
    }>;

export type AcademyWithSafeRelations = Omit<AcademyWithFullRelations, "owners"> & { owners: SafeUser[] };

export interface RequestAcademy extends RequestAuth {
    academy?: AcademyGetPayload<{ include: { owners: true, wallet: true } }>;
    isOwner?: boolean
}

export type AcademyRequestHandler = (
    req: RequestAcademy,
    res: Response,
    next: NextFunction
) => Promise<Response>

export interface IAcademyService {
    create: (data: DTO.CreateAcademyDto) => Promise<Academy>;

    update: (data: DTO.UpdateAcademyDto) => Promise<Academy>;

    delete: (data: DTO.DeleteAcademyDto) => Promise<Academy>;

    addOwner: (data: DTO.AddOwnerDto) => Promise<Omit<AcademyGetPayload<{ include: { owners: true } }>, "owners"> & { owners: SafeUser[] }>;

    deleteOwner: (data: DTO.DeleteOwnerDto) => Promise<Omit<AcademyGetPayload<{ include: { owners: true } }>, "owners"> & { owners: SafeUser[] }>;

    addSocialMedia: (data: DTO.AddSocialMediaDto) => Promise<AcademyGetPayload<{ include: { socialMedia: true } }>>;

    deleteSocialMedia: (data: DTO.DeleteSocialMediaDto) => Promise<AcademyGetPayload<{ include: { socialMedia: true } }>>;

    addPhone: (data: DTO.AddPhoneDto) => Promise<AcademyGetPayload<{ include: { academyPhones: true } }>>;

    deletePhone: (data: DTO.DeletePhoneDto) => Promise<AcademyGetPayload<{ include: { academyPhones: true } }>>;

    addAddress: (data: DTO.AddAddressDto) => Promise<AcademyGetPayload<{ include: { addresses: true } }>>;

    deleteAddress: (data: DTO.DeleteAddressDto) => Promise<AcademyGetPayload<{ include: { addresses: true } }>>;

    getDetails: (academy: DTO.GetAcademyDetailsDto) => Promise<AcademyWithSafeRelations>

    getAll: (data: DTO.GetAllAcademiesDto) => Promise<PaginatedResponse<Academy>>;

    myAcademics: (data: { userId: string; tx?: TransactionClient }) => Promise<Academy[]>;

    deletePaymentLink: (data: DTO.DeletePaymentLinkDto) => Promise<AcademyGetPayload<{ include: { paymentLinks: true } }>>;

    addPaymentLink: (data: DTO.AddPaymentLinkDto) => Promise<AcademyGetPayload<{ include: { paymentLinks: true } }>>;
}


export interface IAcademyController {
    create: AuthRequestHandler
    update: AcademyRequestHandler
    delete: AcademyRequestHandler

    addOwner: AcademyRequestHandler
    deleteOwner: AcademyRequestHandler

    addSocialMedia: AcademyRequestHandler
    deleteSocialMedia: AcademyRequestHandler

    addPhone: AcademyRequestHandler
    deletePhone: AcademyRequestHandler

    addAddress: AcademyRequestHandler
    deleteAddress: AcademyRequestHandler

    getDetails: AcademyRequestHandler
    getAll: AcademyRequestHandler
    myAcademics: AuthRequestHandler

    addPaymentLink: AcademyRequestHandler
    deletePaymentLink: AcademyRequestHandler
}