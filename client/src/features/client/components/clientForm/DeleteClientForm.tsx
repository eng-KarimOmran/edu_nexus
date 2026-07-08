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
  const { setConfigDialog } = useDialogState();

  const params: DeleteClientDto["params"] = {
    academyId,
    clientId: item.id,
  };

  const config: FormProps<{ name: string }, Client> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: `اكتب "${item.name}" لتأكيد الحذف`,
        placeholder: "اكتب الاسم للتأكيد",
      },
    ],

    schema: matchSchema("name", "اسم العميل", item.name),

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
