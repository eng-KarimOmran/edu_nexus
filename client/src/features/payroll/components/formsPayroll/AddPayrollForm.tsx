import Form, { type FormProps } from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";

import type { CreatePayrollDto } from "../../payroll.dto";
import type { Payroll } from "../../payroll.type";

import { createPayroll } from "../../api/payroll.service";
import { createPayrollSchema } from "../../payroll.schema";

import { queryKey as queryKeyPayroll } from "../../payroll.constants";
import { queryKey as queryKeyJobProfile } from "../../../jobProfile/jobProfile.constants";

export default function AddPayrollForm(body: CreatePayrollDto["body"]) {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<CreatePayrollDto["body"], Payroll> = {
    inputs: [
      {
        name: "baseSalary",
        type: "number",
        label: "الراتب الأساسي",
        col: "half",
      },
      {
        name: "lessonsAmount",
        type: "number",
        label: "قيمة الحصة",
        col: "half",
      },
      {
        name: "subscriptionsAmount",
        type: "number",
        label: "قيمة الاشتراك الواحد الجديد",
        col: "half",
      },
      {
        name: "bonusAmount",
        type: "number",
        label: "مكافآت إضافية",
        col: "half",
      },
      {
        name: "deductions",
        type: "number",
        label: "الخصومات",
        col: "half",
      },
    ],

    schema: createPayrollSchema.body,

    defaultValues: body,

    submitButton: {
      text: "إنشاء كشف المرتب",
    },

    service: (body) =>
      createPayroll({
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyJobProfile });
      queryClient.invalidateQueries({ queryKey: queryKeyPayroll });
      toast.success("تم إنشاء كشف المرتب بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
