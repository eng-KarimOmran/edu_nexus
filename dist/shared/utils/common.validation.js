"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plateNumber = exports.boolean = exports.booleanQuery = exports.walletMovementStatus = exports.platform = exports.transactionType = exports.jobProfileType = exports.clientSource = exports.subscriptionStatus = exports.lessonStatus = exports.paymentMethod = exports.transmission = exports.supportType = exports.futureDate = exports.date = exports.limit = exports.count = exports.price = exports.page = exports.number = exports.positiveNumber = exports.url = exports.address = exports.password = exports.phone = exports.entityName = exports.personName = exports.id = void 0;
const zod_1 = __importDefault(require("zod"));
const enums_1 = require("../../prisma/generated/enums");
const dayjs_1 = __importDefault(require("dayjs"));
exports.id = zod_1.default.string().transform((val) => val.toLowerCase()).pipe(zod_1.default.cuid2({ message: "معرف غير صالح" }));
exports.personName = zod_1.default
    .string("الاسم مطلوب")
    .trim()
    .min(2, "يجب أن يتكون الاسم من حرفين على الأقل")
    .max(50, "الاسم طويل جدًا (الحد الأقصى 50 حرفًا)")
    .regex(/^[\u0621-\u064Aa-zA-Z\s]+$/, "يجب أن يحتوي الاسم على حروف فقط");
exports.entityName = zod_1.default
    .string("الاسم مطلوب")
    .trim()
    .min(2, "يجب أن يتكون الاسم من حرفين على الأقل")
    .max(50, "الاسم طويل جدًا (الحد الأقصى 50 حرفًا)")
    .regex(/^[\u0621-\u064Aa-zA-Z0-9\s]+$/, "يجب أن يحتوي الاسم على حروف وأرقام فقط");
exports.phone = zod_1.default
    .string("رقم الهاتف مطلوب")
    .regex(/^01[0125]\d{8}$/, "رقم هاتف مصري غير صالح");
exports.password = zod_1.default
    .string("كلمة المرور مطلوبة")
    .min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل")
    .max(32, "كلمة المرور طويلة جدًا");
exports.address = zod_1.default
    .string("العنوان مطلوب")
    .trim()
    .min(5, "يجب أن يتكون العنوان من 5 أحرف على الأقل")
    .max(150, "العنوان طويل جدًا");
exports.url = zod_1.default.string("الرابط مطلوب").url("صيغة الرابط غير صالحة");
// --- Numbers & Finance ---
exports.positiveNumber = zod_1.default.coerce
    .number()
    .positive("يجب أن يكون رقمًا موجبًا");
exports.number = zod_1.default.coerce.number().min(0, "لا يمكن أن يكون الرقم سالبًا");
exports.page = zod_1.default.coerce
    .number()
    .positive("يجب أن يكون رقمًا موجبًا")
    .optional()
    .default(1);
exports.price = zod_1.default.coerce.number().min(0, "لا يمكن أن يكون السعر سالبًا");
exports.count = zod_1.default.coerce
    .number()
    .int("يجب أن يكون رقمًا صحيحًا")
    .min(1, "يجب أن يكون العدد 1 على الأقل");
exports.limit = zod_1.default.coerce.number().int().min(1).max(100).optional().default(50);
// --- Dates ---
exports.date = zod_1.default.coerce.date();
exports.futureDate = zod_1.default.coerce
    .date()
    .refine((val) => (0, dayjs_1.default)(val).isAfter((0, dayjs_1.default)().subtract(1, "minute")), {
    message: "يجب أن يكون التاريخ في الحاضر أو المستقبل",
});
// --- Enums Validation ---
exports.supportType = zod_1.default.enum(enums_1.SupportType, "نوع الدعم غير صالح");
exports.transmission = zod_1.default.enum(enums_1.Transmission, "نوع الدعم غير صالح");
exports.paymentMethod = zod_1.default.enum(enums_1.PaymentMethod, "طريقة الدفع غير صالحة");
exports.lessonStatus = zod_1.default.enum(enums_1.LessonStatus, "حالة الحصة غير صالحة");
exports.subscriptionStatus = zod_1.default.enum(enums_1.SubscriptionStatus, "حالة الاشتراك غير صالحة");
exports.clientSource = zod_1.default.enum(enums_1.ClientSource, "مصدر العميل غير صالح");
exports.jobProfileType = zod_1.default.enum(enums_1.JobProfileType, "نوع الملف الوظيفي غير صالح");
exports.transactionType = zod_1.default.enum(enums_1.TransactionType, "نوع العملية غير صالح");
exports.platform = zod_1.default.enum(enums_1.Platform, "المنصة غير صالحة");
exports.walletMovementStatus = zod_1.default.enum(enums_1.WalletMovementStatus, "حالة عملية الدفع غير صالحة");
exports.booleanQuery = zod_1.default.enum(["true", "false"]).transform((value) => value === "true");
exports.boolean = zod_1.default.boolean();
exports.plateNumber = zod_1.default
    .string("رقم اللوحة مطلوب")
    .min(3, "رقم لوحة غير صالح")
    .max(10, "رقم اللوحة طويل جدًا");
