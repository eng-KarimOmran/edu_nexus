import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";
import { queryKey } from "../../user.constants";
import type { User } from "../../user.type";
import type { DeleteUserDto } from "../../user.dto";
import { matchSchema } from "@/lib/matchSchema";
import { deleteUser } from "../../api/user.service";

export default function DeleteUserForm({ item }: { item: User }) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const params: DeleteUserDto["params"] = { userId: item.id };

  const config: FormProps<{ name: string }, User> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: `اكتب "${item.name}" لتأكيد الحذف`,
        placeholder: "اكتب الاسم للتأكيد",
      },
    ],

    schema: matchSchema("name", "اسم المستخدم", item.name),

    submitButton: {
      text: "حذف المستخدم",
      
      variant: "destructive",
    },

    service: () => deleteUser({ params }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("تم حذف المستخدم بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
