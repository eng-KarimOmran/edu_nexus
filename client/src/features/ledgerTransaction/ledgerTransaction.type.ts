import type {
    PaymentMethod,
    TransactionType,
    WalletMovementStatus
} from "@/types/enums";
import type { Image } from "@/types/image";
import type { Academy } from "../academy/academy.type";

export interface WalletMovement {
    id: string;
    academyId: string;
    transactionType: TransactionType;
    paymentMethod: PaymentMethod;
    senderId: string;
    receiverId: string;
    amount: string;
    paymentProofImageId: string | null;
    createdAt: string;
    subscriptionId: string | null;
    walletMovementStatus: WalletMovementStatus;
    paymentProofImage: Image | null;
}


export interface LedgerTransactionParty {
    academy: Academy | null;
    jobProfile: LedgerTransactionJobProfile | null;
    subscription: LedgerTransactionSubscription | null;
}

export interface LedgerTransactionSubscription {
    id: string;
    client: LedgerTransactionClient;
}

export interface LedgerTransactionClient {
    id: string;
    name: string;
    phone: string;
}

export interface LedgerTransactionJobProfile {
    id: string;
    user: LedgerTransactionUser;
}

export interface LedgerTransactionUser {
    id: string;
    name: string;
    phone: string;
}

export interface LedgerTransactionLesson {
    id: string;
}

export interface LedgerTransactionDetails extends WalletMovement {
    sender: LedgerTransactionParty;
    receiver: LedgerTransactionParty;
    lessons: LedgerTransactionLesson[];
    academy: Academy;
}