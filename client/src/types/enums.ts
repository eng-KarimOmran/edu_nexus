export const JobProfileType = {
  SECRETARY: "SECRETARY",
  CAPTAIN: "CAPTAIN",
  MANAGER: "MANAGER",
} as const;

export type JobProfileType = (typeof JobProfileType)[keyof typeof JobProfileType];

export const Transmission = {
  MANUAL: "MANUAL",
  AUTOMATIC: "AUTOMATIC",
} as const;

export type Transmission = (typeof Transmission)[keyof typeof Transmission];

export const SupportType = {
  MANUAL: "MANUAL",
  AUTOMATIC: "AUTOMATIC",
  BOTH: "BOTH",
} as const;

export type SupportType = (typeof SupportType)[keyof typeof SupportType];

export const LessonStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
  CANCELED_CHARGED: "CANCELED_CHARGED",
} as const;

export type LessonStatus = (typeof LessonStatus)[keyof typeof LessonStatus];

export const PaymentMethod = {
  MONETARY: "MONETARY",
  ELECTRONIC: "ELECTRONIC",
  TRANSFER: "TRANSFER"
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const Platform = {
  FACEBOOK: "FACEBOOK",
  TIKTOK: "TIKTOK",
  INSTAGRAM: "INSTAGRAM",
  TWITTER: "TWITTER",
  YOUTUBE: "YOUTUBE",
  LINKEDIN: "LINKEDIN",
  SNAPCHAT: "SNAPCHAT",
  WHATSAPP: "WHATSAPP",
  GOOGLEMAP: "GOOGLEMAP",
  GMAIL: "GMAIL"
} as const;

export type Platform = (typeof Platform)[keyof typeof Platform];

export const WalletMovementStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const

export type WalletMovementStatus = (typeof WalletMovementStatus)[keyof typeof WalletMovementStatus]

export const SubscriptionStatus = {
  PENDING_DEPOSIT: "PENDING_DEPOSIT",
  PENDING_FIRST_SESSION: "PENDING_FIRST_SESSION",
  GRACE_PERIOD: "GRACE_PERIOD",
  SUSPENDED: "SUSPENDED",
  ACTIVE: "ACTIVE",
  CANCELED: "CANCELED",
  COMPLETED: "COMPLETED",
  FULLY_BOOKED: "FULLY_BOOKED"
} as const;

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const ClientSource = {
  PLATFORM: "PLATFORM",
  OFFICE: "OFFICE",
} as const;

export type ClientSource = (typeof ClientSource)[keyof typeof ClientSource];

export const TransactionType = {
  SUBSCRIPTION_CREATED: "SUBSCRIPTION_CREATED",

  CUSTOMER_PAYMENT: "CUSTOMER_PAYMENT",

  SUBSCRIPTION_CANCELLED: "SUBSCRIPTION_CANCELLED",

  CUSTOMER_REFUND: "CUSTOMER_REFUND",

  EMPLOYEE_TRANSFER_TO_EMPLOYEE: "EMPLOYEE_TRANSFER_TO_EMPLOYEE",
  ACADEMY_TRANSFER_TO_EMPLOYEE: "ACADEMY_TRANSFER_TO_EMPLOYEE",
  EMPLOYEE_TRANSFER_TO_ACADEMY: "EMPLOYEE_TRANSFER_TO_ACADEMY",

  MANUAL_ADJUSTMENT: "MANUAL_ADJUSTMENT",
} as const

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const WalletType = {
  CLIENT: 'CLIENT',
  ACADEMY: 'ACADEMY',
  JOB_PROFILE: 'JOB_PROFILE'
} as const

export type WalletType = (typeof WalletType)[keyof typeof WalletType]