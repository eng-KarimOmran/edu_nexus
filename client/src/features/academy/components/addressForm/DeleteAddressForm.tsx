import Form, { type FormProps } from "@/components/Form/Form";
import { matchSchema } from "@/lib/matchSchema";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";

import { queryKey } from "../../academy.constants";
import { deleteAddress } from "../../api/academy.service";
import type { DeleteAddressDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";

export default function DeleteAddressForm({
  academyId,
  addressId,
}: {
  academyId: string;
  addressId: string;
}) {
  const { setConfigDialog } = useDialogState();

  const params: DeleteAddressDto["params"] = {
    academyId,
    addressId,
  };

  const config: FormProps<{ text: string }, Academy> = {
    inputs: [
      {
        name: "text",
        type: "text",
        label: "اكتب ( حذف ) لتأكيد الحذف",
        placeholder: "اكتب حذف",
      },
    ],

    schema: matchSchema("text", "كلمة التأكيد", "حذف"),

    submitButton: {
      text: "حذف",
      variant: "destructive",
    },

    service: () =>
      deleteAddress({
        params,
      }),

    onSuccess: () => {
      toast.success("تم حذف العنوان بنجاح");

      queryClient.invalidateQueries({
        queryKey: [...queryKey, academyId],
      });

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}