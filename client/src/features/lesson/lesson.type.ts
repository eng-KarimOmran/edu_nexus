import type { Transmission, LessonStatus } from "@/types/enums";
import type { Car } from "../car/car.type";
import type { Area } from "../area/area.type";
import type { Client } from "../client/client.type";
import type { JobProfile } from "../jobProfile/jobProfile.type";

export type Lesson = {
    id: string;
    startTime: string;
    endTime: string;
    lessonStatus: LessonStatus;
    transmission: Transmission
    sessionDurationMinutes: number;
    expectedPaymentAmount: number;
    carSessionPrice: number;
    captainLessonPrice: number;
    academyId: string;
    subscriptionId: string;
    carId: string;
    clientId: string;
    jobProfileId: string;
    areaId: string;
    walletMovementId: string | null;
    payrollId: string | null;
    createdAt: string;

    car: Car,

    area: Area,

    client: Client,

    jobProfile: JobProfile
};