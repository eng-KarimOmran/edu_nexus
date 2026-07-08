import { enumTranslations } from "@/lib/enumTranslations";
import { ClientSource } from "@/types/enums";

export const filters = [
    {
        group: "مصدر العميل",
        option: [
            {
                key: "source",
                label: enumTranslations[ClientSource.PLATFORM],
                val: ClientSource.PLATFORM,
            },
            {
                key: "source",
                label: enumTranslations[ClientSource.OFFICE],
                val: ClientSource.OFFICE,
            },
        ],
    },
];