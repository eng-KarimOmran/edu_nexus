import type { AppRoute } from "./app-routes.types";
import { PATHS } from "./paths";

import UserPage from "@/features/user/pages/UserPage";
import UserDetailsPage from "@/features/user/pages/UserDetailsPage";

import AcademyPage from "@/features/academy/pages/AcademyPage";
import AcademyDetailsPage from "@/features/academy/pages/AcademyDetailsPage";

import AreaPage from "@/features/area/pages/AreaPage";
import AreaDetailsPage from "@/features/area/pages/AreaDetailsPage";

import CarPage from "@/features/car/pages/CarPage";
import CarDetailsPage from "@/features/car/pages/CarDetailsPage";

import JobProfilePage from "@/features/jobProfile/pages/JobProfilePage";
import JobProfileDetailsPage from "@/features/jobProfile/pages/JobProfileDetailsPage";

import ClientPage from "@/features/client/pages/ClientPage";
import ClientDetailsPage from "@/features/client/pages/ClientDetailsPage";

import CoursePage from "@/features/course/pages/CoursePage";
import CourseDetailsPage from "@/features/course/pages/CourseDetailsPage";

import LessonPage from "@/features/lesson/pages/LessonPage";
import LessonDetailsPage from "@/features/lesson/pages/LessonDetailsPage";

import SubscriptionPage from "@/features/subscription/pages/SubscriptionPage";
import SubscriptionDetailsPage from "@/features/subscription/pages/SubscriptionDetailsPage";

import LedgerTransactionPage from "@/features/ledgerTransaction/pages/LedgerTransactionPage";

import StatisticsPage from "@/features/statistics/pages/StatisticsPage";

import CustomerManagementPage from "@/features/employee/pages/CustomerManagementPage";
import GetAllLessonsPage from "@/features/employee/pages/GetAllLessonsPage";
import MyLessonsPage from "@/features/employee/pages/MyLessonsPage";
import MyDebtsPage from "@/features/employee/pages/MyDebtsPage";
import DebtsPage from "@/features/employee/pages/DebtsPage";

import {
  RiBriefcaseLine,
  RiCalendarScheduleLine,
  RiCarLine,
  RiExchangeDollarLine,
  RiFileList3Fill,
  RiGraduationCapFill,
  RiLayout2Line,
  RiRoadMapLine,
  RiRouteLine,
  RiSchoolFill,
  RiSteering2Line,
  RiUserSettingsFill,
  RiWalletFill,
} from "@remixicon/react";

import { ROLES } from "./roles";

import ChangePasswordDashboardPage from "@/features/auth/pages/ChangePasswordDashboard";
import GetAllCarAndLesson from "@/features/employee/pages/GetAllCarAndLesson";

export const DASHBOARD_ROUTES: AppRoute[] = [
  {
    path: PATHS.dashboard,
    element: <StatisticsPage />,
    nav: {
      label: "لوحة التحكم",
      icon: <RiLayout2Line />,
    },
    roles: [ROLES.OWNER],
  },

  {
    path: PATHS.customerManagement,
    element: <CustomerManagementPage />,
    nav: {
      label: "إدارة العملاء",
      icon: <RiLayout2Line />,
    },
    roles: [ROLES.SECRETARY, ROLES.MANAGER],
  },

  {
    path: PATHS.lessonSchedule,
    element: <GetAllLessonsPage />,
    nav: {
      label: "جدول الحصص",
      icon: <RiCalendarScheduleLine />,
    },
    roles: [ROLES.OWNER, ROLES.SECRETARY, ROLES.MANAGER],
  },
  {
    path: PATHS.carAndLesson,
    element: <GetAllCarAndLesson />,
    nav: {
      label: "جدول الحصص المحجوزه",
      icon: <RiCalendarScheduleLine />,
    },
    roles: [ROLES.OWNER, ROLES.SECRETARY, ROLES.MANAGER],
  },

  {
    path: PATHS.captainTodayLessons,
    element: <MyLessonsPage date="today" />,
    nav: {
      label: "حصص اليوم",
      icon: <RiLayout2Line />,
    },
    roles: [ROLES.CAPTAIN, ROLES.MANAGER],
  },

  {
    path: PATHS.captainTomorrowLessons,
    element: <MyLessonsPage date="tomorrow" />,
    nav: {
      label: "حصص غدًا",
      icon: <RiLayout2Line />,
    },
    roles: [ROLES.CAPTAIN, ROLES.MANAGER],
  },

  {
    path: PATHS.clients,
    element: <ClientPage />,
    nav: {
      label: "العملاء",
      icon: <RiGraduationCapFill />,
    },
    roles: [ROLES.OWNER],
  },

  {
    path: PATHS.subscriptions,
    element: <SubscriptionPage />,
    nav: {
      label: "الاشتراكات",
      icon: <RiFileList3Fill />,
    },
    roles: [ROLES.OWNER],
  },

  {
    path: PATHS.lessons,
    element: <LessonPage />,
    nav: {
      label: "الحصص",
      icon: <RiSteering2Line />,
    },
    roles: [ROLES.OWNER],
  },

  {
    path: PATHS.transactions,
    element: <LedgerTransactionPage />,
    nav: {
      label: "المعاملات المالية",
      icon: <RiExchangeDollarLine />,
    },
    roles: [ROLES.OWNER],
  },

  {
    path: PATHS.courses,
    element: <CoursePage />,
    nav: {
      label: "البرامج",
      icon: <RiRouteLine />,
    },
    roles: [ROLES.OWNER],
  },

  {
    path: PATHS.jobProfiles,
    element: <JobProfilePage />,
    nav: {
      label: "الملفات الوظيفية",
      icon: <RiBriefcaseLine />,
    },
    roles: [ROLES.ADMIN],
  },

  {
    path: PATHS.allDebts,
    element: <DebtsPage />,
    nav: {
      label: "مديونية الموظفين",
      icon: <RiWalletFill />,
    },
    roles: [ROLES.MANAGER],
  },

  {
    path: PATHS.academies,
    element: <AcademyPage />,
    nav: {
      label: "الأكاديميات",
      icon: <RiSchoolFill />,
    },
    roles: [ROLES.OWNER, ROLES.ADMIN],
  },

  {
    path: PATHS.cars,
    element: <CarPage />,
    nav: {
      label: "السيارات",
      icon: <RiCarLine />,
    },
    roles: [ROLES.ADMIN],
  },

  {
    path: PATHS.areas,
    element: <AreaPage />,
    nav: {
      label: "المناطق",
      icon: <RiRoadMapLine />,
    },
    roles: [ROLES.ADMIN],
  },

  {
    path: PATHS.users,
    element: <UserPage />,
    nav: {
      label: "المستخدمين",
      icon: <RiUserSettingsFill />,
    },
    roles: [ROLES.ADMIN],
  },

  {
    path: PATHS.userDetails,
    element: <UserDetailsPage />,
    roles: [ROLES.ADMIN],
  },

  {
    path: PATHS.academyDetails,
    element: <AcademyDetailsPage />,
    roles: [ROLES.OWNER],
  },

  {
    path: PATHS.areaDetails,
    element: <AreaDetailsPage />,
    roles: [ROLES.ADMIN],
  },

  {
    path: PATHS.carDetails,
    element: <CarDetailsPage />,
    roles: [ROLES.ADMIN],
  },

  {
    path: PATHS.jobProfileDetails,
    element: <JobProfileDetailsPage />,
    roles: [ROLES.ADMIN],
  },

  {
    path: PATHS.clientDetails,
    element: <ClientDetailsPage />,
    roles: [ROLES.OWNER, ROLES.SECRETARY, ROLES.MANAGER],
  },

  {
    path: PATHS.courseDetails,
    element: <CourseDetailsPage />,
    roles: [ROLES.OWNER],
  },

  {
    path: PATHS.lessonDetails,
    element: <LessonDetailsPage />,
    roles: [ROLES.OWNER],
  },

  {
    path: PATHS.myDebts,
    element: <MyDebtsPage />,
    roles: [ROLES.SECRETARY, ROLES.CAPTAIN, ROLES.MANAGER, ROLES.OWNER],
  },

  {
    path: PATHS.subscriptionDetails,
    element: <SubscriptionDetailsPage />,
    roles: [ROLES.OWNER, ROLES.SECRETARY, ROLES.MANAGER],
  },

  {
    path: PATHS.changePassword,
    element: <ChangePasswordDashboardPage />,
    roles: [
      ROLES.OWNER,
      ROLES.ADMIN,
      ROLES.CAPTAIN,
      ROLES.MANAGER,
      ROLES.SECRETARY,
    ],
  },
];
