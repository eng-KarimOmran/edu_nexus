import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";
import { matchSchema } from "@/lib/matchSchema";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";
import { queryKey } from "../../academy.constants";
import type { DeletePhoneDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";
import { deletePhone } from "../../api/academy.service";

export default function DeletePhoneForm({
  academyId,
  phoneId,
}: {
  academyId: string;
  phoneId: string;
}) {
  const { setConfigDialog } = useDialogState();
  const params: DeletePhoneDto["params"] = { academyId, phoneId };

  const config: FormProps<{ text: string }, Academy> = {
    inputs: [
      {
        name: "text",
        type: "text",
        label: `اكتب ( حذف ) لتأكيد الحذف`,
        placeholder: `اكتب حذف`,
      },
    ],

    schema: matchSchema("text", "كلمة التأكيد", "حذف"),

    submitButton: {
      text: "حذف",
      
      variant: "destructive",
    },

    service: async () => deletePhone({ params }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKey, academyId] });
      toast.success("تم حذف رقم هاتف الأكاديمية بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
