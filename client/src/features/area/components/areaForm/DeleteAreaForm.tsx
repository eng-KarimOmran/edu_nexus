import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { matchSchema } from "@/lib/matchSchema";

import { useDialogState } from "@/store/DialogState";

import { deleteArea } from "../../api/area.service";

import { queryKey } from "../../area.constants";

import type { Area } from "../../area.type";
import type { DeleteAreaDto } from "../../area.dto";

export default function DeleteAreaForm({
  item,
}: {
  item: Area;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const params: DeleteAreaDto["params"] = {
    areaId: item.id,
  };

  const config: FormProps<{ name: string }, Area> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: `اكتب "${item.name}" لتأكيد الحذف`,
      },
    ],

    schema: matchSchema("name", "اسم المنطقة", item.name),

    submitButton: {
      text: "حذف المنطقة",
      
      variant: "destructive",
    },

    service: () => deleteArea({ params }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم حذف المنطقة");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
