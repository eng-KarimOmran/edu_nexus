import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";

import { supportTypeOptions } from "@/lib/enumOptions";

import { useDialogState } from "@/store/DialogState";

import { updateArea } from "../../api/area.service";

import { queryKey } from "../../area.constants";
import { UpdateAreaSchema } from "../../area.schema";

import type { Area } from "../../area.type";
import type { UpdateAreaDto } from "../../area.dto";

export default function UpdateAreaForm({ item }: { item: Area }) {
  const { setConfigDialog } = useDialogState();

  const params: UpdateAreaDto["params"] = {
    areaId: item.id,
  };

  const config: FormProps<UpdateAreaDto["body"], Area> = {
    defaultValues: {
      name: item.name,
      supportType: item.supportType,
      isActive: item.isActive,
    },

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
      {
        name: "isActive",
        type: "switch",
        label: "نشطة",
      },
    ],

    schema: UpdateAreaSchema.body,

    submitButton: {
      text: "حفظ التعديلات",
    },

    service: (body) =>
      updateArea({
        params,
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم تحديث المنطقة");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
