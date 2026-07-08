import { enumTranslations } from "@/lib/enumTranslations";
import { SubscriptionStatus } from "@/types/enums";

export const filters = [
    {
        group: "الحالة",

        option: [
            {
                key: "subscriptionStatus",
                label: enumTranslations[SubscriptionStatus.ACTIVE],
                val: SubscriptionStatus.ACTIVE,
            },
            {
                key: "subscriptionStatus",
                label: enumTranslations[SubscriptionStatus.COMPLETED],
                val: SubscriptionStatus.COMPLETED,
            },
            {
                key: "subscriptionStatus",
                label: enumTranslations[SubscriptionStatus.CANCELED],
                val: SubscriptionStatus.CANCELED,
            },
            {
                key: "subscriptionStatus",
                label: enumTranslations[SubscriptionStatus.PENDING_DEPOSIT],
                val: SubscriptionStatus.PENDING_DEPOSIT,
            },
            {
                key: "subscriptionStatus",
                label: enumTranslations[SubscriptionStatus.GRACE_PERIOD],
                val: SubscriptionStatus.GRACE_PERIOD,
            }, {
                key: "subscriptionStatus",
                label: enumTranslations[SubscriptionStatus.PENDING_FIRST_SESSION],
                val: SubscriptionStatus.PENDING_FIRST_SESSION,
            },
            {
                key: "subscriptionStatus",
                label: enumTranslations[SubscriptionStatus.SUSPENDED],
                val: SubscriptionStatus.SUSPENDED,
            },
        ],
    },
];