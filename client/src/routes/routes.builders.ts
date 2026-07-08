export const ROUTE_BUILDERS = {
    academyDetails: (academyId: string) =>
        `/dashboard/academy/${academyId}`,

    userDetails: (userId: string) =>
        `/dashboard/user/${userId}`,

    jobProfileDetails: (jobProfileId: string) =>
        `/dashboard/job-profile/${jobProfileId}`,

    clientDetails: (academyId: string, clientId: string) =>
        `/dashboard/academy/${academyId}/client/${clientId}`,

    subscriptionDetails: (academyId: string, subscriptionId: string) =>
        `/dashboard/academy/${academyId}/subscription/${subscriptionId}`,

    lessonDetails: (academyId: string, lessonId: string) =>
        `/dashboard/academy/${academyId}/lesson/${lessonId}`,

    courseDetails: (academyId: string, courseId: string) =>
        `/dashboard/academy/${academyId}/course/${courseId}`,

    areaDetails: (areaId: string) =>
        `/dashboard/area/${areaId}`,

    carDetails: (carId: string) =>
        `/dashboard/car/${carId}`,

    accountDetails: (academyId: string, accountId: string) =>
        `/dashboard/academy/${academyId}/account/${accountId}`,

    transactionDetails: (academyId: string, transactionId: string) =>
        `/dashboard/academy/${academyId}/transaction/${transactionId}`,
};