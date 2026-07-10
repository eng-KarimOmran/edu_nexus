import type { Platform } from "@/types/enums";
import type { User } from "../user/user.type";
import type { Wallet } from "@/types/wallet";
import type { Image } from "@/types/image";

export interface Academy {
    id: string;
    name: string;
    profileTrackingUrl?: string
    createdAt: string;

}

export interface AcademyPhone {
    id: string;
    phone: string;
    academyId: string;
}

export interface AcademyAddress {
    id: string;
    address: string;
    academyId: string;
}

export interface AcademyRule {
    id: string;
    content: string;
    academyId: string;
}

export interface SocialMediaLink {
    id: string;
    platform: Platform;
    url: string;
    academyId: string;
}

export interface PaymentLink {
    id: string;
    url: string;
    phone: string;
    walletProvider: string;
    academyId: string;
}

export interface AcademyDetails extends Academy {
    academyPhones: AcademyPhone[];

    addresses: AcademyAddress[];

    owners: User[];

    paymentLinks: PaymentLink[];

    socialMedia: SocialMediaLink[];

    logo: Image | null;

    wallet: Wallet[]

    academyRules: AcademyRule[]
}