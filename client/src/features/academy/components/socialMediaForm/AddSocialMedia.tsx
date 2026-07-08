import Form, { type FormProps } from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";
import type { AddSocialMediaDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";
import { platformOptions } from "@/lib/enumOptions";
import { AcademySchema } from "../../academy.schema";
import { addSocialMedia } from "../../api/academy.service";
import { queryKey } from "../../academy.constants";

export default function AddSocialMediaForm({ academyId }: { academyId: string }) {
  const { setConfigDialog } = useDialogState();
  const params: AddSocialMediaDto["params"] = { academyId };

  const config: FormProps<AddSocialMediaDto["body"], Academy> = {
    inputs: [
      {
        name: "platform",
        type: "select",
        label: "المنصة",
        placeholder: "اختار المنصة",
        options: platformOptions,
      },
      {
        name: "url",
        type: "url",
        label: "رابط المنصة",
        placeholder: "اكتب رابط المنصة",
      },
    ],
    submitButton: {
      
      text: "اضافة المنصة",
    },
    schema: AcademySchema.socialMedia.add.body,
    service: (data) => addSocialMedia({ body: data, params }),
    onSuccess: () => {
      toast.success("تم اضافة المالك بنجاح");
      queryClient.invalidateQueries({ queryKey: [...queryKey, academyId] });
      setConfigDialog(null);
    },
  };
  return <Form {...config} />;
}