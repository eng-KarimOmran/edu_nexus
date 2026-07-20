import Form, { type FormProps } from "@/components/Form/Form";
import { matchSchema } from "@/lib/matchSchema";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";
import type { DeleteOwnerDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";
import { deleteOwner } from "../../api/academy.service";
import { queryKey } from "../../academy.constants";

export default function DeleteOwnerForm({
  phone,
  academyId,
  ownerId,
}: {
  phone: string;
  academyId: string;
  ownerId: string;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);
  const params: DeleteOwnerDto["params"] = { academyId, userId: ownerId };

  const config: FormProps<{ phone: string }, Academy> = {
    inputs: [
      {
        name: "phone",
        type: "tel",
        label: `اكتب ( ${phone} ) لتأكيد الحذف`,
        placeholder: `اكتب ${phone}`,
      },
    ],

    schema: matchSchema("phone", "رقم المالك", phone),

    submitButton: {
      text: "حذف",
      variant: "destructive",
    },

    service: async () => deleteOwner({ params }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKey, academyId] });
      toast.success("تم حذف الأكاديمية بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}