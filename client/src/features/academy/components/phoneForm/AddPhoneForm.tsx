import Form, { type FormProps } from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";

import { AcademySchema } from "../../academy.schema";
import { addPhone } from "../../api/academy.service";
import { queryKey } from "../../academy.constants";
import type { AddPhoneDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";

export default function AddPhoneForm({ academyId }: { academyId: string }) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const params: AddPhoneDto["params"] = {
    academyId,
  };

  const config: FormProps<AddPhoneDto["body"], Academy> = {
    inputs: [
      {
        name: "phone",
        type: "tel",
        label: "رقم الهاتف",
        placeholder: "ادخل رقم الهاتف",
      },
    ],

    schema: AcademySchema.phone.add.body,

    submitButton: {
      text: "إضافة",
      
    },

    service: (body) => addPhone({ body, params }),

    onSuccess: () => {
      toast.success("تم إضافة الرقم بنجاح");
      queryClient.invalidateQueries({
        queryKey: [...queryKey, academyId],
      });
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}