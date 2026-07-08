export type Course = {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    priceOriginal: number;
    priceDiscounted: number;
    requiredInitialDeposit: number;
    totalSessions: number;
    sessionsBeforeFullPayment: number;
    sessionDurationMinutes: number;
    featuredReason: string;
    academyId: string;
    createdAt: string;
};

export type CourseFeature = {
    id: string;
    feature: string;
    courseId: string;
};

export interface CourseDetails extends Course {
    features: CourseFeature[];
}