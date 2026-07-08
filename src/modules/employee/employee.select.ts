import {
    JobProfileGetPayload,
    JobProfileSelect,
} from "@/prisma/generated/models";

export const jobProfileSelect = {
    id: true,
    user: {
        select: {
            id: true,
            name: true,
            phone: true,
        },
    },
    wallets: {
        select: {
            id: true,
            balance: true,
            academy: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
} satisfies JobProfileSelect;

export type JobProfileSelectType = JobProfileGetPayload<{
    select: typeof jobProfileSelect;
}>;