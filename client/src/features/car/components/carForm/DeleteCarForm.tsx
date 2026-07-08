import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { matchSchema } from "@/lib/matchSchema";

import { useDialogState } from "@/store/DialogState";

import { queryKey } from "../../car.constants";

import type { Car } from "../../car.type";

import { deleteCar } from "../../api/car.service";
import type { DeleteDto } from "../../car.dto";

export default function DeleteCarForm({ item }: { item: Car }) {
  const { setConfigDialog } = useDialogState();

  const params: DeleteDto["params"] = { carId: item.id };

  const config: FormProps<{ modelName: string }, Car> = {
    inputs: [
      {
        name: "modelName",
        type: "text",
        label: `اكتب "${item.modelName}" لتأكيد الحذف`,
      },
    ],

    schema: matchSchema("modelName", "موديل السيارة", item.modelName),

    submitButton: {
      text: "حذف السيارة",

      variant: "destructive",
    },

    service: () => deleteCar({ params }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم حذف السيارة");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}