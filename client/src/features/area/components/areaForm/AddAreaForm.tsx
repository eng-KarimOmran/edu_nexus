import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { supportTypeOptions } from "@/lib/enumOptions";

import { useDialogState } from "@/store/DialogState";

import { createArea } from "../../api/area.service";

import { queryKey } from "../../area.constants";
import { CreateAreaSchema } from "../../area.schema";

import type { Area } from "../../area.type";
import type { CreateAreaDto } from "../../area.dto";

export default function AddAreaForm() {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const config: FormProps<CreateAreaDto["body"], Area> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: "اسم المنطقة",
      },
      {
        name: "supportType",
        type: "select",
        label: "نوع الدعم",
        options: supportTypeOptions,
      },
    ],

    schema: CreateAreaSchema.body,

    submitButton: {
      text: "إضافة المنطقة",
    },

    service: (body) =>
      createArea({
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم إضافة المنطقة");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
