import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { matchSchema } from "@/lib/matchSchema";

import { useDialogState } from "@/store/DialogState";

import { queryKey } from "../../client.constants";

import type { Client } from "../../client.type";
import type { DeleteClientDto } from "../../client.dto";

import { deleteClient } from "../../api/client.service";

export default function DeleteClientForm({
  academyId,
  item,
}: {
  academyId: string;
  item: Client;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const params: DeleteClientDto["params"] = {
    academyId,
    clientId: item.id,
  };

  const config: FormProps<{ text: string }, Client> = {
    inputs: [
      {
        name: "text",
        type: "text",
        label: `اكتب "حذف" لتأكيد الحذف`,
        placeholder: "اكتب حذف للتأكيد",
      },
    ],

    schema: matchSchema("text", "حذف", "حذف"),

    submitButton: {
      text: "حذف العميل",
      
      variant: "destructive",
    },

    service: () => deleteClient({ params }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم حذف العميل بنجاح");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
