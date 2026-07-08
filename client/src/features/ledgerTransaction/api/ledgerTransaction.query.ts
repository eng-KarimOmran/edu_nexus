import { useQuery } from "@tanstack/react-query";

import useAppQuery from "@/hooks/useAppQuery";

import type { WalletMovement } from "../ledgerTransaction.type";

import type {
    GetAllLedgerTransactionsDto,
} from "../ledgerTransaction.dto";

import {
    getAllLedgerTransactions,
    getLedgerTransactionDetails,
} from "./ledgerTransaction.service";

import { queryKey } from "../ledgerTransaction.constants";

export const useLedgerTransactions = (academyId?: string) => {
    return useAppQuery<GetAllLedgerTransactionsDto, WalletMovement>({
        queryFn: (params) => {
            if (!academyId) {
                throw Error("معرف الأكاديمية مطلوب");
            }

            return getAllLedgerTransactions({
                params: {
                    academyId,
                },
                query: params.query,
            });
        },

        queryKey: [...queryKey, academyId],

        keepPrevious: true,

        filters: [
            "transactionType",
            "paymentMethod",
        ],
    });
};

export const useLedgerTransactionDetails = (
    academyId?: string,
    ledgerTransactionId?: string
) => {
    return useQuery({
        queryKey: [
            ...queryKey,
            academyId,
            ledgerTransactionId,
        ],

        queryFn: () => {
            if (!academyId || !ledgerTransactionId) {
                throw Error("بيانات الطلب غير مكتملة");
            }

            return getLedgerTransactionDetails({
                params: {
                    academyId,
                    ledgerTransactionId,
                },
            });
        },

        select: (res) => res.data.data,

        enabled: !!ledgerTransactionId,
    });
};