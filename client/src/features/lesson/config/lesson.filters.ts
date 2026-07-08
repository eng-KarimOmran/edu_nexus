import { enumTranslations } from "@/lib/enumTranslations";

import {
    LessonStatus,
    Transmission,
} from "@/types/enums";

export const filters = [
    {
        group: "نوع التدريب",

        option: [
            {
                key: "transmission",
                label: enumTranslations[Transmission.AUTOMATIC],
                val: Transmission.AUTOMATIC,
            },

            {
                key: "transmission",
                label: enumTranslations[Transmission.MANUAL],
                val: Transmission.MANUAL,
            },
        ],
    },

    {
        group: "حالة الحصة",

        option: [
            {
                key: "lessonStatus",
                label: enumTranslations[LessonStatus.SCHEDULED],
                val: LessonStatus.SCHEDULED,
            },

            {
                key: "lessonStatus",
                label: enumTranslations[LessonStatus.COMPLETED],
                val: LessonStatus.COMPLETED,
            },

            {
                key: "lessonStatus",
                label: enumTranslations[LessonStatus.CANCELED],
                val: LessonStatus.CANCELED,
            },

            {
                key: "lessonStatus",
                label:
                    enumTranslations[
                    LessonStatus.CANCELED_CHARGED
                    ],
                val: LessonStatus.CANCELED_CHARGED,
            },
        ],
    },
];