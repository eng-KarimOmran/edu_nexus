import z from "zod";

export const matchSchema = <T extends string>(
  fieldName: T,
  fieldLabel: string,
  expectedValue: string,
) =>
  z.object({
    [fieldName]: z
      .string()
      .min(1, `لازم تكتب ${fieldLabel}`)
      .refine((val) => val === expectedValue, {
        message: `${fieldLabel} غير مطابق`,
      }),
  }) as z.ZodObject<{ [K in T]: z.ZodString }>;
