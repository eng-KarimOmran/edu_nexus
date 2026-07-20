import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";
import { matchSchema } from "@/lib/matchSchema";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";
import { queryKey } from "../../academy.constants";
import type { DeleteSocialMediaDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";
import { deleteSocialMedia } from "../../api/academy.service";

export default function DeleteSocialMediaForm({
  academyId,
  socialMediaId,
}: {
  academyId: string;
  socialMediaId: string;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);
  const params: DeleteSocialMediaDto["params"] = { academyId, socialMediaId };

  const config: FormProps<{ text: string }, Academy> = {
    inputs: [
      {
        name: "text",
        type: "text",
        label: `اكتب ( حذف ) لتأكيد الحذف`,
        placeholder: `اكتب حذف`,
      },
    ],

    schema: matchSchema("text", "كلمة التأكيد", "حذف"),

    submitButton: {
      text: "حذف",
      
      variant: "destructive",
    },

    service: async () => deleteSocialMedia({ params }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKey, academyId] });
      toast.success("تم حذف منصة التواصل الأجمتماعي بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
