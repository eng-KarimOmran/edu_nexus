import { enumTranslations } from "@/lib/enumTranslations";
import { JobProfileType, SupportType } from "@/types/enums";


export const filters = [
    {
        group: "الحالة",
        option: [
            {
                key: "isActive",
                label: "نشط",
                val: "true",
            },
            {
                key: "isActive",
                label: "غير نشط",
                val: "false",
            },
        ],
    },
    {
        group: "الصلاحية",
        option: [
            {
                key: "jobProfileType",
                label: enumTranslations[JobProfileType.CAPTAIN],
                val: JobProfileType.CAPTAIN,
            },
            {
                key: "jobProfileType",
                label: enumTranslations[JobProfileType.MANAGER],
                val: JobProfileType.MANAGER,
            },
            {
                key: "jobProfileType",
                label: enumTranslations[JobProfileType.SECRETARY],
                val: JobProfileType.SECRETARY,
            },
        ],
    },
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
            {
                key: "supportType",
                label: enumTranslations[SupportType.BOTH],
                val: SupportType.BOTH,
            },
        ],
    },
];