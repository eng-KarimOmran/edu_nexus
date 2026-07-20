import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";

import { clientSourceOptions } from "@/lib/enumOptions";

import { queryKey } from "../../client.constants";

import type { Client } from "../../client.type";
import type { CreateClientDto } from "../../client.dto";

import { createClient } from "../../api/client.service";
import { CreateClientSchema } from "../../client.schema";
import { useAcademy } from "@/features/academy/api/academy.query";
import { useNavigate } from "react-router-dom";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";

export default function AddClientForm() {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);
  const { data, isLoading } = useAcademy();
  const navigate = useNavigate();

  const placeholderAcademyId = isLoading
    ? "جاري تحميل الأكاديميات..."
    : data
      ? "اختار الاكاديمية"
      : "لا يوجد اكاديميات";

  const config: FormProps<CreateClientDto["body"], Client> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: "الاسم",
        placeholder: "اسم العميل",
      },
      {
        name: "phone",
        type: "tel",
        label: "رقم الهاتف",
        placeholder: "01xxxxxxxxx",
      },
      {
        name: "source",
        type: "select",
        label: "مصدر العميل",
        options: clientSourceOptions,
        col: "half",
      },
      {
        name: "academyId",
        type: "select",
        label: "الأكاديمية",
        placeholder: placeholderAcademyId,
        options: data?.items.map((o) => ({ label: o.name, value: o.id })),
        disabled: !data?.items.length,
        col: "half",
      },
    ],

    schema: CreateClientSchema.body,

    submitButton: {
      text: "إضافة العميل",
    },

    defaultValues: {
      source: "OFFICE",
    },

    service: (body) => {
      return createClient({ body });
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey,
      });
      toast.success("تم إضافة العميل بنجاح");
      setConfigDialog(null);
      if ("data" in data) {
        navigate(
          ROUTE_BUILDERS.clientDetails(data.data.academyId, data.data.id),
        );
      }
    },
  };

  return <Form {...config} />;
}
