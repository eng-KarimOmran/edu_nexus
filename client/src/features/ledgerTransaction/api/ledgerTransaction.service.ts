
import { axiosClient } from "@/lib/axios";

import type {
    PaginatedResponse,
    SuccessfulResponse,
} from "@/types/axios";

import * as Dto from "../ledgerTransaction.dto";
import type { LedgerTransactionDetails, WalletMovement } from "../ledgerTransaction.type";

type Entity = WalletMovement;
type EntityDetails = LedgerTransactionDetails;

const ledgerTransactionUrl = {
    base: (academyId: string) =>
        `/academies/${academyId}/wallet-movement`,

    byId: (
        academyId: string,
        ledgerTransactionId: string
    ) =>
        `/academies/${academyId}/wallet-movement/${ledgerTransactionId}`,

    changeStatus: (academyId: string,
        ledgerTransactionId: string) => `/academies/${academyId}/wallet-movement/${ledgerTransactionId}/change-status`,

    transferFunds: (academyId: string) => `/academies/${academyId}/wallet-movement/transfer-funds`,
};

export const createLedgerTransaction = (
    data: Dto.ProcessPaymentTransactionSchemaDto
) => {
    const { params, body } = data;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        ledgerTransactionUrl.base(params.academyId),
        body
    );
};

export const getAllLedgerTransactions = (
    data: Dto.GetAllLedgerTransactionsDto
) => {
    const { params, query } = data;

    return axiosClient.get<PaginatedResponse<Entity>>(
        ledgerTransactionUrl.base(params.academyId),
        {
            params: query,
        }
    );
};

export const getLedgerTransactionDetails = (
    data: Dto.GetLedgerTransactionDetailsDto
) => {
    const { params } = data;

    return axiosClient.get<
        SuccessfulResponse<EntityDetails>
    >(
        ledgerTransactionUrl.byId(
            params.academyId,
            params.ledgerTransactionId
        )
    );
};

export const changeLedgerTransactionStatus = (
    data: Dto.ChangeLedgerTransactionStatusDto
) => {
    const { params, body } = data;

    return axiosClient.patch<SuccessfulResponse<Entity>>(`${ledgerTransactionUrl.byId(params.academyId, params.ledgerTransactionId)}/change-status`,
        body
    );
};

export const transferFunds = (
    data: Dto.TransferFundsDto
) => {
    const { params, body } = data;

    return axiosClient.post<SuccessfulResponse<Entity>>(
        ledgerTransactionUrl.transferFunds(params.academyId),
        body
    );
};

export const deleteLedgerTransaction = (
    data: Dto.DeleteLedgerTransactionDto
) => {
    const { params } = data;

    return axiosClient.delete<SuccessfulResponse<Entity>>(
        ledgerTransactionUrl.byId(params.academyId, params.walletMovementId)
    );
};