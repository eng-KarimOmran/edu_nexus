import { WalletMovement } from "@/prisma/generated/client";
import { TransactionClient } from "@/prisma/generated/internal/prismaNamespace";
import { PaginatedResponse } from "../../shared/types/types";
import { AcademyRequestHandler } from "../academy/academy.type";
import { JobProfileRequestHandler } from "../jobProfile/jobProfile.type";

import {
    ChangeWalletMovementStatusDto,
    DeleteWalletMovementDto,
    GetAllWalletMovementDto,
    GetLedgerTransactionDetailsDto,
    ProcessPaymentTransactionDto,
    TransferFundsDto
} from "./walletMovement.dto";

export interface IWalletMovementService {
    getAllWalletMovements(
        data: GetAllWalletMovementDto
    ): Promise<PaginatedResponse<WalletMovement>>;

    getWalletMovementDetails(
        data: GetLedgerTransactionDetailsDto
    ): Promise<WalletMovement>;

    changeWalletMovementStatus(
        data: ChangeWalletMovementStatusDto
    ): Promise<WalletMovement>;

    transferFunds(data: TransferFundsDto & { tx?: TransactionClient, isOwner?: boolean, jobProfileId?: string }): Promise<WalletMovement>;

    processPaymentTransaction(data: ProcessPaymentTransactionDto & { tx?: TransactionClient, isOwner?: boolean, jobProfileId?: string }): Promise<WalletMovement>

    deleteWalletMovement(data: DeleteWalletMovementDto & { tx?: TransactionClient }): Promise<boolean>
}

export interface IWalletMovementController {
    getAllWalletMovements: AcademyRequestHandler;

    getWalletMovementDetails: JobProfileRequestHandler;

    changeWalletMovementStatus: AcademyRequestHandler;

    processPaymentTransaction: JobProfileRequestHandler

    transferFunds: JobProfileRequestHandler

    deleteWalletMovement: JobProfileRequestHandler
}