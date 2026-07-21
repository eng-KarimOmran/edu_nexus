
export const PATHS = {
    // ==========================
    // Common
    // ==========================
    dashboard: "",
    changePassword: "change-password",

    // ==========================
    // Admin
    // ==========================
    users: "user",
    userDetails: "user/:userId",

    academies: "academy",
    academyDetails: "academy/:academyId",

    // ==========================
    // Owner
    // ==========================
    jobProfiles: "job-profile",
    jobProfileDetails: "job-profile/:jobProfileId",

    clients: "client",
    clientDetails:
        "academy/:academyId/client/:clientId",

    subscriptions:
        "subscription",
    subscriptionDetails:
        "academy/:academyId/subscription/:subscriptionId",

    lessons: "lesson",
    lessonDetails: "academy/:academyId/lesson/:lessonId",
    lessonSchedule: "lesson-schedule",

    courses: "course",
    courseDetails: "academy/:academyId/course/:courseId",

    areas: "area",
    areaDetails:
        "area/:areaId",

    cars: "car",
    carDetails:
        "car/:carId",

    accounts: "account",
    accountDetails:
        "academy/:academyId/account/:accountId",

    transactions:
        "transaction",
    transactionDetails:
        "academy/:academyId/transaction/:transactionId",

    // ==========================
    // Secretary
    // ==========================
    customerManagement: "customer-management",
    pendingCustomers: "pending-customers",

    // ==========================
    // Captain
    // ==========================
    captainTodayLessons:
        "my-lessons/today",

    captainTomorrowLessons:
        "my-lessons/tomorrow",

    myDebts: "my-debts",

    allDebts: "all-debts",

    carAndLesson: "car-and-lesson",

    employeeWithLessons: "employee-with-lessons"
} as const;