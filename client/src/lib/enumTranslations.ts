export const enumTranslations = {
  // Role
  SECRETARY: "سكرتير",
  CAPTAIN: "مدرب",
  MANAGER: "مدير",

  // Transmission & SupportType
  MANUAL: "مانيوال",
  AUTOMATIC: "أوتوماتيك",
  BOTH: "مانيوال أو أوتوماتيك",

  // LessonStatus
  SCHEDULED: "مجدول",
  COMPLETED: "مكتمل",
  CANCELED: "ملغي",
  CANCELED_CHARGED: "ملغي مع احتساب الرسوم",

  // PaymentMethod
  MONETARY: "نقدي",
  ELECTRONIC: "إلكتروني",
  TRANSFER: "تحويل",

  // Platform
  FACEBOOK: "فيسبوك",
  TIKTOK: "تيك توك",
  INSTAGRAM: "إنستجرام",
  TWITTER: "تويتر",
  YOUTUBE: "يوتيوب",
  LINKEDIN: "لينكدإن",
  SNAPCHAT: "سناب شات",
  WHATSAPP: "واتساب",
  GOOGLEMAP: "خرائط جوجل",
  GMAIL: "جميل",

  // LedgerTransactionStatus
  PENDING: "قيد الانتظار",
  APPROVED: "معتمد",
  REJECTED: "مرفوض",

  // SubscriptionStatus
  PENDING_DEPOSIT: "في انتظار دفع العربون",
  PENDING_FIRST_SESSION: "في انتظار أول حصة",
  GRACE_PERIOD: "فترة سماح",
  SUSPENDED: "موقوف",
  ACTIVE: "نشط",
  FULLY_BOOKED: "تم حجز كل الحصص",

  // ClientSource
  PLATFORM: "المنصة",
  OFFICE: "المكتب",

  // ReferenceCategory
  lessonId: "حصة",
  paymentId: "دفعة",
  ledgerId: "قيد مالي",
  subscriptionId: "اشتراك",

  // TransactionType
  CUSTOMER_PAYMENT: "استلام دفعة من العميل",
  CUSTOMER_REFUND: "رد مبلغ للعميل",

  SUBSCRIPTION_CREATED: "اضافة مديونية الاشتراك",
  SUBSCRIPTION_CANCELLED: "استرداد مديونية الاشتراك",

  EMPLOYEE_TRANSFER_TO_EMPLOYEE: "تحويل رصيد بين موظفين",
  ACADEMY_TRANSFER_TO_EMPLOYEE: "تحويل رصيد من الأكاديمية إلى الموظف",
  EMPLOYEE_TRANSFER_TO_ACADEMY: "تحويل رصيد من الموظف إلى الأكاديمية",

  MANUAL_ADJUSTMENT: "تسوية أو تعديل يدوي",

  // TransactionParty
  ACADEMY: "الأكاديمية",
  USER: "موظف",
  SUBSCRIPTION: "اشتراك",

  // Boolean
  TRUE: "نعم",
  FALSE: "لا",
} as const;