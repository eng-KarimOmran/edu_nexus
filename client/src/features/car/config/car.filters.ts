import { enumTranslations } from "@/lib/enumTranslations";

import { Transmission } from "@/types/enums";

export const filters = [
    {
        group: "نوع الفتيس",
        option: [
            {
                key: "gearType",
                label: enumTranslations[Transmission.AUTOMATIC],
                val: Transmission.AUTOMATIC,
            },
            {
                key: "gearType",
                label: enumTranslations[Transmission.MANUAL],
                val: Transmission.MANUAL,
            },
        ],
    },
    {
        group: "الحالة",
        option: [
            {
                key: "isActive",
                label: "نشطة",
                val: "true",
            },
            {
                key: "isActive",
                label: "متوقفة",
                val: "false",
            },
        ],
    },
];