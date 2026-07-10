import { Client } from "@/prisma/generated/client";
import { LessonSelect, LessonWhereInput } from "@/prisma/generated/models";
import { prisma } from "../../lib/prisma";
import ApiError from "../../shared/utils/ApiError";
import { jobProfileSelect } from "./employee.select";
import { IEmployeeService } from "./employee.type";

const EmployeeService: IEmployeeService = {
    async getJobProfileDebts({ jobProfileId }) {
        return await prisma.wallet.findMany({ where: { jobProfileId }, include: { academy: true } })
    },

    async getAllLessons({ query }) {
        const { startTime, endTime, lessonStatus, jobProfileId } = query

        const where: LessonWhereInput = {
            startTime: { gte: startTime },
            endTime: { lte: endTime },
            ...(jobProfileId && { jobProfileId: jobProfileId }),
            ...(lessonStatus && { lessonStatus: lessonStatus }),
        }

        const select: LessonSelect = {
            id: true,
            startTime: true,
            endTime: true,
            lessonStatus: true,
            subscriptionId: true,
            expectedPaymentAmount: true,
            car: { select: { id: true, modelName: true, plateNumber: true } },
            area: { select: { id: true, name: true } },
            client: { select: { id: true, name: true, phone: true } },
            academy: { select: { id: true, name: true } },
            jobProfile: { select: { id: true, user: { select: { id: true, name: true, phone: true } } } }
        }

        const lessons = await prisma.lesson.findMany({ where, select, orderBy: { startTime: "asc" } });

        return lessons
    },

    async getClient({ query }) {
        const { search } = query

        let client: Client | null = null

        const isPhone = /^01[0125]\d{8}$/.test(search)

        if (isPhone) {
            client = await prisma.client.findFirst({ where: { phone: search } })
        } else {
            client = await prisma.client.findUnique({ where: { id: search } })
        }

        if (!client) throw ApiError.NotFound("Client")

        return client
    },

    async getEmployeesWithDebts() {
        return await prisma.jobProfile.findMany({
            select: jobProfileSelect
        })
    },

    async getAllCarAndLesson({ query }) {
        return prisma.car.findMany({
            include: {
                lessons: {
                    where: {
                        lessonStatus: "SCHEDULED",
                        ...(query.startTime &&
                            query.endTime && {
                            startTime: {
                                gte: new Date(query.startTime),
                                lte: new Date(query.endTime),
                            },
                        }),
                    },
                    select: {
                        id: true, startTime: true, endTime: true,
                        client: { select: { id: true, name: true, phone: true } }
                    }
                }
            }
        });
    }
};

export default EmployeeService;