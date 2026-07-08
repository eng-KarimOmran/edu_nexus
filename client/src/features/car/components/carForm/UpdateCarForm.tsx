import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";

import { transmissionOptions } from "@/lib/enumOptions";

import { queryKey } from "../../car.constants";

import type { Car } from "../../car.type";
import type { UpdateDto } from "../../car.dto";

import { updateCar } from "../../api/car.service";
import { UpdateCarSchema } from "../../car.schema";

export default function UpdateCarForm({ item }: { item: Car }) {
  const { setConfigDialog } = useDialogState();

  const params: UpdateDto["params"] = {
    carId: item.id,
  };

  const config: FormProps<UpdateDto["body"], Car> = {
    defaultValues: {
      modelName: item.modelName,
      plateNumber: item.plateNumber,
      gearType: item.gearType,
      carSessionPrice: item.carSessionPrice,
      isActive: item.isActive,
    },

    inputs: [
      {
        name: "modelName",
        type: "text",
        label: "موديل السيارة",
      },
      {
        name: "plateNumber",
        type: "text",
        label: "رقم اللوحة",
      },
      {
        name: "gearType",
        type: "select",
        label: "نوع الفتيس",
        options: transmissionOptions,
      },
      {
        name: "carSessionPrice",
        type: "number",
        label: "سعر الحصة",
      },
      {
        name: "isActive",
        type: "switch",
        label: "نشطة",
      },
    ],

    schema: UpdateCarSchema.body,

    submitButton: {
      text: "حفظ التعديلات",
    },

    service: (body) =>
      updateCar({
        params,
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم تحديث السيارة");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
