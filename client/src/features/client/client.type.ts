import type { ClientSource } from "@/types/enums";
import type { Academy } from "../academy/academy.type";
import type { Subscription } from "../subscription/subscription.type";
import type { Wallet } from "@/types/wallet";

export interface Client {
    id: string;
    name: string;
    phone: string;
    source: ClientSource
    createdAt: string;
    academyId: string;
}

interface WalletClient extends Wallet {
    clientId: string;
}

export interface CurrentClient extends Client {
    subscriptions: Subscription[];
    academy: Academy
    wallet: WalletClient
}

export interface OtherFile extends Client {
    academy: Academy
}

export interface ClientDetails {
    currentClient: CurrentClient;
    otherFiles: OtherFile[];
}