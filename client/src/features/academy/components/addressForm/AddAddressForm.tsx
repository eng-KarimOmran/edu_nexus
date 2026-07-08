import Form, { type FormProps } from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";

import { AcademySchema } from "../../academy.schema";
import { queryKey } from "../../academy.constants";
import { addAddress } from "../../api/academy.service";
import type { AddAddressDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";

export default function AddAddressForm({ academyId }: { academyId: string }) {
  const { setConfigDialog } = useDialogState();

  const params: AddAddressDto["params"] = {
    academyId,
  };

  const config: FormProps<AddAddressDto["body"], Academy> = {
    inputs: [
      {
        name: "address",
        type: "text",
        label: "العنوان",
        placeholder: "اكتب العنوان",
      },
    ],

    schema: AcademySchema.address.add.body,

    submitButton: {
      text: "إضافة العنوان",
    },

    service: (body) =>
      addAddress({
        body,
        params,
      }),

    onSuccess: () => {
      toast.success("تم إضافة العنوان بنجاح");
      queryClient.invalidateQueries({
        queryKey: [...queryKey, academyId],
      });
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
