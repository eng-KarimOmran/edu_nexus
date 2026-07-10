import { queryKey } from "../../academy.constants";
import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";
import type { Academy } from "../../academy.type";
import type { UpdateAcademyDto } from "../../academy.dto";
import { AcademySchema } from "../../academy.schema";
import { updateAcademy } from "../../api/academy.service";

export default function UpdateAcademyForm({ item }: { item: Academy }) {
  const { setConfigDialog } = useDialogState();
  const params: UpdateAcademyDto["params"] = { academyId: item.id };

  const config: FormProps<UpdateAcademyDto["body"], Academy> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: "اسم الأكاديمية",
        placeholder: "اكتب اسم الأكاديمية",
      },
      {
        name: "profileTrackingUrl",
        type: "url",
        label: "رابط متابعة العميل",
        placeholder: "اكتب رابط متابعة العميل",
      },
    ],

    defaultValues: {
      name: item.name,
      profileTrackingUrl: item.profileTrackingUrl,
    },

    schema: AcademySchema.update.body,

    submitButton: {
      text: "تعديل بيانات الأكاديمية",
    },

    service: (data) => updateAcademy({ body: data, params }),

    onSuccess: () => {
      toast.success("تم تعديل بيانات الأكاديمية بنجاح");
      queryClient.invalidateQueries({ queryKey });
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
