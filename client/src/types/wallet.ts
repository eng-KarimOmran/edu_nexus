import type { WalletType } from "./enums";

export interface Wallet {
    id: string;
    balance: number;
    academyId: string
    walletType: WalletType
}