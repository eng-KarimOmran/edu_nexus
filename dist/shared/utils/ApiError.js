"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFLICT_MESSAGES = void 0;
const ErrorResponse_1 = __importDefault(require("./ErrorResponse"));
const NOT_FOUND_MESSAGES = {
    User: "المستخدم غير موجود",
    BlacklistedToken: "الجلسة انتهت أو الرمز غير صالح",
    Academy: "الأكاديمية غير موجودة",
    SocialMedia: "منصة التواصل الاجتماعي غير موجودة",
    Address: "العنوان غير موجود",
    Phone: "رقم الهاتف غير موجود",
    Car: "السيارة غير موجودة",
    Area: "المنطقة غير موجودة",
    Client: "العميل غير موجود",
    Subscription: "الاشتراك غير موجود",
    Course: "الدورة التدريبية غير موجودة",
    Lesson: "الحصة غير موجودة",
    Captain: "المدرب غير موجود",
    ProofOfPaymentImage: "إثبات الدفع غير موجود",
    TrainingDetails: "خصائص البرنامج غير موجودة",
    walletMovement: "المعاملة غير موجودة",
    Employee: "الموظف غير موجود",
    PaymentLink: "رابط الدفع غير موجود",
    AcademyPhone: "رقم الأكاديمية غير موجود",
    AcademyAddress: "عنوان الأكاديمية غير موجود",
    AcademyPaymentLink: "رابط الدفع غير موجود",
    PATH_NOT_FOUND: "المسار غير موجود",
    JobProfile: "الملف الوظيفي غير موجد",
    CourseFeature: "ميزة البرنامج غير موجوده",
    Sender: "الحساب المالى للمرسل غير موجود",
    Receiver: "الحساب المالى للمستلم غير موجود",
    wallet: "المحفظة غير موجود",
    Payroll: "الراتب غير موجود",
};
exports.CONFLICT_MESSAGES = {
    // Identity / Uniqueness
    PHONE_ALREADY_EXISTS: "رقم الهاتف مسجل بالفعل",
    EMAIL_ALREADY_EXISTS: "البريد الإلكتروني مستخدم بالفعل",
    NAME_ALREADY_EXISTS: "هذا الاسم مستخدم مسبقاً",
    ADDRESS_ALREADY_EXISTS: "العنوان مسجل بالفعل",
    // Vehicle
    PLATE_NUMBER_ALREADY_EXISTS: "رقم اللوحة مسجل لسيارة أخرى بالفعل",
    // Roles / Profiles
    CAPTAIN_PROFILE_EXISTS: "هذا الموظف لديه ملف كابتن بالفعل",
    SECRETARY_PROFILE_EXISTS: "هذا الموظف لديه ملف سكرتارية بالفعل",
    ROLE_ALREADY_ASSIGNED: "المستخدم لديه بالفعل الصلاحية",
    USER_ALREADY_EXISTS: "يوجد مستخدم بالفعل",
    OWNER_ALREADY_ASSIGNED: "المستخدم مالك بالفعل",
    // Financial
    OVERPAYMENT: "المبلغ المدفوع يتجاوز الرصيد المطلوب",
    EXCESS_REFUND: "مبلغ الاسترداد يتجاوز إجمالي المدفوع",
    INSUFFICIENT_REMAINING_BALANCE: "الرصيد المتبقي غير كافٍ",
    SUBSCRIPTION_ALREADY_PAID: "هذا الاشتراك تم سداده بالكامل",
    SUBSCRIPTION_ALREADY_CANCELLED: "هذا الاشتراك ملغي بالفعل",
    // Scheduling
    CAPTAIN_TIME_CONFLICT: "الكابتن لديه حصة أخرى في هذا الوقت",
    CAR_TIME_CONFLICT: "السيارة محجوزة في هذا الوقت",
    CLIENT_TIME_CONFLICT: "العميل لديه حصة أخرى في هذا الوقت",
    // Platform / System
    PLATFORM_ALREADY_EXISTS: "المنصة مسجلة بالفعل",
    SOCIAL_MEDIA_ALREADY_EXISTS: "منصة التواصل الاجتماعي مسجلة بالفعل",
    JOB_PROFILE_EXISTS: "المستخدم لديه ملف وظيفي بالأكاديمية",
    PAYMENT_SENDER_MUST_BE_SUBSCRIPTION: "في عملية الدفع يجب أن يكون المرسل هو الاشتراك",
    REFUND_RECEIVER_MUST_BE_SUBSCRIPTION: "في عملية الاسترداد يجب أن يكون المستلم هو الاشتراك",
    LESSON_NOT_SCHEDULED: "لا يمكن تعديل بيانات الحصة إلا في حالة الجدولة",
    PAYROLL_ALREADY_EXISTS: "تم انشاء راتب لهذه الفترة من قبل",
    IMAGE_ALREADY_EXISTS: "هذه الصورة مكرره",
    SENDER_EQ_RECEIVER: "لا يمكن أن يكون المرسل هو المستلم",
    LESSON_COUNT_EXCEEDS_ACTUAL: "لا يمكن أن يكون عدد الحصص أكبر من العدد الفعلي الذي حققه الموظف",
    SUBSCRIPTION_COUNT_EXCEEDS_ACTUAL: "لا يمكن أن يكون عدد الاشتراكات أكبر من العدد الفعلي الذي حققه الموظف",
};
const ApiError = {
    NotFound(model) {
        return new ErrorResponse_1.default(NOT_FOUND_MESSAGES[model], 404);
    },
    Conflict(field, customMessage) {
        return new ErrorResponse_1.default(customMessage ?? exports.CONFLICT_MESSAGES[field] ?? "حدث تعارض في البيانات", 409);
    },
    Forbidden(message = "غير مسموح لك بالوصول") {
        return new ErrorResponse_1.default(message, 403);
    },
    AccountBlocked(message = "تم حظر هذا الحساب. يرجى التواصل مع الإدارة") {
        return new ErrorResponse_1.default(message, 403);
    },
    Unauthorized(message = "يرجى تسجيل الدخول أولاً") {
        return new ErrorResponse_1.default(message, 401);
    },
    ValidationError(message = "بيانات غير صحيحة") {
        return new ErrorResponse_1.default(message, 422);
    },
    BadRequest(message) {
        return new ErrorResponse_1.default(message, 400);
    },
    Inactive(model, message) {
        const messages = {
            Course: "هذا الكورس غير مفعل حالياً",
            Captain: "هذا الكابتن غير مفعل حالياً",
            Car: "هذه السيارة غير مفعلة حالياً",
            Area: "هذه المنطقة غير مفعلة حالياً",
        };
        return new ErrorResponse_1.default(message ?? messages[model], 400);
    },
    Internal(message = "حدث خطأ غير متوقع في الخادم") {
        return new ErrorResponse_1.default(message, 500);
    },
    passwordChangeRequired(message = "يجب عليك تغيير كلمة المرور الافتراضية أولاً قبل استخدام النظام") {
        return new ErrorResponse_1.default(message, 403);
    },
    InvalidCredentials(data) {
        let message = "رقم الهاتف أو كلمة المرور غير صحيحة";
        if (data?.password) {
            message = "كلمة المرور الحاليه غير صحيحة";
        }
        return new ErrorResponse_1.default(message, 401);
    },
};
exports.default = ApiError;
