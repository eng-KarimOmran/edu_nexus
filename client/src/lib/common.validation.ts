import z from "zod";

import {
  LessonStatus,
  PaymentMethod,
  Transmission,
  SubscriptionStatus,
  ClientSource,
  SupportType,
  TransactionType,
  JobProfileType,
  Platform,
  WalletMovementStatus,
} from "@/types/enums";

import dayjs from "dayjs";


export const id = z.string().transform((val) => val.toLowerCase()).pipe(z.cuid2({ message: "معرف غير صالح" }));

export const personName = z
  .string("الاسم مطلوب")
  .trim()
  .min(2, "يجب أن يتكون الاسم من حرفين على الأقل")
  .max(50, "الاسم طويل جدًا (الحد الأقصى 50 حرفًا)")
  .regex(/^[\u0621-\u064Aa-zA-Z\s]+$/, "يجب أن يحتوي الاسم على حروف فقط");

export const entityName = z
  .string("الاسم مطلوب")
  .trim()
  .min(2, "يجب أن يتكون الاسم من حرفين على الأقل")
  .max(50, "الاسم طويل جدًا (الحد الأقصى 50 حرفًا)")
  .regex(
    /^[\u0621-\u064Aa-zA-Z0-9\s]+$/,
    "يجب أن يحتوي الاسم على حروف وأرقام فقط",
  );

export const phone = z
  .string("رقم الهاتف مطلوب")
  .regex(/^01[0125]\d{8}$/, "رقم هاتف مصري غير صالح");

export const password = z
  .string("كلمة المرور مطلوبة")
  .min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل")
  .max(32, "كلمة المرور طويلة جدًا");

export const address = z
  .string("العنوان مطلوب")
  .trim()
  .min(5, "يجب أن يتكون العنوان من 5 أحرف على الأقل")
  .max(150, "العنوان طويل جدًا");

export const url = z.string("الرابط مطلوب").url("صيغة الرابط غير صالحة");

// --- Numbers & Finance ---

export const positiveNumber = z.coerce.number<number>()
  .positive("يجب أن يكون رقمًا موجبًا");

export const number = z.coerce.number<number>().min(0, "لا يمكن أن يكون الرقم سالبًا")

export const page = z.coerce.number<number>()
  .positive("يجب أن يكون رقمًا موجبًا")
  .optional()
  .default(1)

export const price = z.coerce.number<number>().min(0, "لا يمكن أن يكون السعر سالبًا");

export const count = z.coerce.number<number>()
  .int("يجب أن يكون رقمًا صحيحًا")
  .min(1, "يجب أن يكون العدد 1 على الأقل");

export const limit = z.coerce.number<number>().int().min(1).max(100).optional().default(10);

// --- Dates ---

export const date = z.coerce.date<Date>();

export const futureDate = z.coerce.date<Date>()
  .refine((val) => dayjs(val).isAfter(dayjs().subtract(1, "minute")), {
    message: "يجب أن يكون التاريخ في الحاضر أو المستقبل",
  });

// --- Enums Validation ---

export const supportType = z.enum(SupportType, "نوع الدعم غير صالح");
export const transmission = z.enum(Transmission, "نوع الدعم غير صالح");
export const paymentMethod = z.enum(PaymentMethod, "طريقة الدفع غير صالحة");
export const lessonStatus = z.enum(LessonStatus, "حالة الحصة غير صالحة");
export const subscriptionStatus = z.enum(SubscriptionStatus, "حالة الاشتراك غير صالحة");
export const clientSource = z.enum(ClientSource, "مصدر العميل غير صالح");
export const jobProfileType = z.enum(JobProfileType, "نوع الصلاحية غير صالح");
export const transactionType = z.enum(TransactionType, "نوع العملية غير صالح");
export const platform = z.enum(Platform, "المنصة غير صالحة");
export const walletMovementStatus = z.enum(WalletMovementStatus, "حالة عملية الدفع غير صالحة")
export const booleanQuery = z.enum(["true", "false"]).transform((value) => value === "true");

export const boolean = z.boolean();

export const plateNumber = z.string("رقم اللوحة مطلوب")
  .min(3, "رقم لوحة غير صالح")
  .max(10, "رقم اللوحة طويل جدًا");