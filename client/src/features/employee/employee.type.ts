import type { LessonStatus } from "@/types/enums";
import type { Car } from "../car/car.type";

export interface wallets {
    id: string;
    balance: number;
    academy: {
        id: string;
        name: string;
    };
}

export interface EmployeeWithDebts {
    id: string;
    user: {
        id: string;
        name: string;
        phone: string;
    };
    wallets: wallets[]
}

export interface Lesson {
    id: string;
    startTime: string;
    endTime: string;
    lessonStatus: LessonStatus;
    subscriptionId: string
    expectedPaymentAmount: number

    car: {
        id: string;
        modelName: string;
        plateNumber: string;
    };

    area: {
        id: string;
        name: string;
    };

    client: {
        id: string;
        name: string;
        phone: string;
    };

    academy: {
        id: string;
        name: string;
    };

    jobProfile: {
        id: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
    };
}

export interface BaseLesson {
    id: string
    startTime: string,
    endTime: string
    subscriptionId: string
    academyId: string
    client: {
        id: string,
        name: string,
        phone: string
    }
    jobProfile: {
        id: string,
        user: {
            id: string,
            name: string,
            phone: string
        }
    },
    area: {
        id: string,
        name: string,
    }
}

export interface CarWithLessons extends Car {
    lessons: BaseLesson[]
}