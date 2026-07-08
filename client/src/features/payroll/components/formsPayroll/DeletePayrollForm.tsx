import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { matchSchema } from "@/lib/matchSchema";
import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import { toast } from "sonner";

import type { DeletePayrollDto } from "../../payroll.dto";
import type { Payroll } from "../../payroll.type";

import { deletePayroll } from "../../api/payroll.service";

import { queryKey as queryKeyPayroll } from "../../payroll.constants";
import { queryKey as queryKeyJobProfile } from "../../../jobProfile/jobProfile.constants";

export default function DeletePayrollForm({ id }: { id: string }) {
  const { setConfigDialog } = useDialogState();

  const params: DeletePayrollDto["params"] = {
    payrollId: id,
  };

  const config: FormProps<{ name: string }, Payroll> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: `اكتب "حذف" لتأكيد حذف كشف المرتب`,
        placeholder: 'اكتب "حذف" للتأكيد',
      },
    ],

    schema: matchSchema("name", "التأكيد", "حذف"),

    submitButton: {
      text: "حذف كشف المرتب",
      variant: "destructive",
    },

    service: () => deletePayroll({ params }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyJobProfile });
      queryClient.invalidateQueries({ queryKey: queryKeyPayroll });
      toast.success("تم حذف كشف المرتب بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
