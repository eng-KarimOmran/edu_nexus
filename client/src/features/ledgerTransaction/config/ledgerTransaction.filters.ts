import { enumTranslations } from "@/lib/enumTranslations";

import {
    PaymentMethod,
    TransactionType,
} from "@/types/enums";

export const filters = [
    {
        group: "نوع العملية",

        option: Object.values(TransactionType).map((item) => ({
            key: "transactionType",
            label: enumTranslations[item],
            val: item,
        })),
    },

    {
        group: "طريقة الدفع",

        option: Object.values(PaymentMethod).map((item) => ({
            key: "paymentMethod",
            label: enumTranslations[item],
            val: item,
        })),
    },
];