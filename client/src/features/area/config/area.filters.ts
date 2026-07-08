import { enumTranslations } from "@/lib/enumTranslations";

import { SupportType } from "@/types/enums";

export const filters = [
    {
        group: "نوع الدعم",
        option: [
            {
                key: "supportType",
                label: enumTranslations[SupportType.AUTOMATIC],
                val: SupportType.AUTOMATIC,
            },
            {
                key: "supportType",
                label: enumTranslations[SupportType.MANUAL],
                val: SupportType.MANUAL,
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