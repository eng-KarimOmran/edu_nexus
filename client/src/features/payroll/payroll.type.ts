import type { Academy } from "../academy/academy.type";

export interface Payroll {
    id: string;

    academyId: string;
    academy: Academy;

    jobProfileId: string

    createdAt: string;

    baseSalary: number;

    totalLessonsCount: number;
    lessonsAmount: number;

    totalSubscriptionsCount: number;
    subscriptionsAmount: number;

    earningsAmount: number;

    grossAmount: number;

    bonusAmount: number;
    deductions: number;

    netAmount: number;
}