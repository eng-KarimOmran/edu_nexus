import { NextFunction, Response } from "express";
import ApiError from "../../shared/utils/ApiError";
import { prisma } from "../../lib/prisma";
import { JobProfileType } from "@/prisma/generated/enums";
import { RequestJobProfile } from "./jobProfile.type";

const allowJobProfiles = (types: JobProfileType[]) => {
    return async (req: RequestJobProfile, _: Response, next: NextFunction) => {
        const academy = req.academy
        const userLogin = req.userLogin

        if (!userLogin) throw ApiError.NotFound("User")

        const isOwner = academy ? academy.owners.some((o) => o.id === userLogin.id) : !!await prisma.academy.findFirst({ where: { owners: { some: { id: userLogin.id } } } })

        const jobProfile = await prisma.jobProfile.findUnique({ where: { userId: userLogin.id } })

        if (!isOwner) {
            if (!jobProfile) throw ApiError.NotFound("JobProfile")

            if (!types.includes(jobProfile.jobProfileType)) {
                throw ApiError.Forbidden()
            }

            if (!jobProfile.isActive) {
                throw ApiError.AccountBlocked("ملفك الوظيفي موقوف حاليًا")
            }
        }

        req.jobProfile = jobProfile ?? undefined

        return next()
    }
}

export default allowJobProfiles