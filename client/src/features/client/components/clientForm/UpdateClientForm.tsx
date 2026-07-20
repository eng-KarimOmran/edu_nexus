import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";

import { clientSourceOptions } from "@/lib/enumOptions";

import { queryKey } from "../../client.constants";

import type { Client } from "../../client.type";
import type { UpdateClientDto } from "../../client.dto";

import { updateClient } from "../../api/client.service";
import { UpdateClientSchema } from "../../client.schema";

export default function UpdateClientForm({
  academyId,
  item,
}: {
  academyId: string;
  item: Client;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const params: UpdateClientDto["params"] = {
    academyId,
    clientId: item.id,
  };

  const config: FormProps<UpdateClientDto["body"], Client> = {
    defaultValues: {
      name: item.name,
      phone: item.phone,
      source: item.source,
    },

    inputs: [
      {
        name: "name",
        type: "text",
        label: "الاسم",
      },
      {
        name: "phone",
        type: "text",
        label: "رقم الهاتف",
        col: "half",
      },
      {
        name: "source",
        type: "select",
        label: "مصدر العميل",
        options: clientSourceOptions,
        col: "half",
      },
    ],

    schema: UpdateClientSchema.body,

    submitButton: {
      text: "حفظ التعديلات",
    },

    service: (body) =>
      updateClient({
        params,
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم تحديث العميل بنجاح");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
