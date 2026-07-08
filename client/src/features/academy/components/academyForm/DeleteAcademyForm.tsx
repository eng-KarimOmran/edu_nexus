import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { matchSchema } from "@/lib/matchSchema";
import { useDialogState } from "@/store/DialogState";
import type { Academy } from "../../academy.type";
import type { DeleteAcademyDto } from "../../academy.dto";
import { deleteAcademy } from "../../api/academy.service";
import { queryKey } from "../../academy.constants";

export default function DeleteAcademyForm({ item }: { item: Academy }) {
  const { setConfigDialog } = useDialogState();
  const params: DeleteAcademyDto["params"] = { academyId: item.id };

  const config: FormProps<{ name: string }, Academy> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: `اكتب اسم الأكاديمية ( ${item.name} ) لتأكيد الحذف`,
        placeholder: `اكتب ${item.name}`,
      },
    ],

    schema: matchSchema("name", "اسم الأكاديمية", item.name),

    submitButton: {
      text: "حذف",
      variant: "destructive",
    },

    service: () => deleteAcademy({ params }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("تم حذف الأكاديمية بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
