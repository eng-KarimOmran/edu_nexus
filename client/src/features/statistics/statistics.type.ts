export interface DashboardStatistics {
  clients: {
    officeCount: number;
    platformCount: number;
    totalClient: number;
  };

  courses: {
    courseId: string;
    name: string;
    count: number;
  }[];

  subscriptions: {
    PENDING_DEPOSIT: number;
    PENDING_FIRST_SESSION: number;
    GRACE_PERIOD: number;
    SUSPENDED: number;
    ACTIVE: number;
    CANCELED: number;
    COMPLETED: number;
    totalSubscription: number;
  };

  ledgerTransaction: {
    totalCash: number;
    totalRefund: number;
    totalCollected: number;
    totalWallet: number;
  };

  lessons: {
    lessonCanceled: number;
    lessonCanceledCharged: number;
    lessonCompleted: number;
    lessonScheduled: number;
    lessonAutomatic: number;
    lessonManual: number;
    totalLesson: number;
  };

  area: {
    areaId: string;
    name: string;
    countLesson: number;
  }[];

  car: {
    carId: string;
    modelName: string;
    plateNumber: string;
    countLesson: number;
  }[];

  captain: {
    captainId: string;
    userId: string;
    name: string;
    phone: string;
    countLesson: number;
  }[];

  usersCreatedSubscription: {
    jobProfilesId: string;
    name: string;
    phone: string;
    countSubscription: number;
  }[];
}