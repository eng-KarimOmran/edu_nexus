import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";

import { transmissionOptions } from "@/lib/enumOptions";

import { queryKey } from "../../car.constants";

import type { Car } from "../../car.type";

import { createCar } from "../../api/car.service";
import { CreateCarSchema } from "../../car.schema";
import type { CreateDto } from "../../car.dto";

export default function AddCarForm() {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<CreateDto["body"], Car> = {
    inputs: [
      {
        name: "modelName",
        type: "text",
        label: "موديل السيارة",
        placeholder: "مثال: نيسان صني 2023",
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
    ],

    schema: CreateCarSchema.body,

    submitButton: {
      text: "إضافة السيارة",
    },

    service: (body) => {
      return createCar({ body });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم إضافة السيارة بنجاح");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
