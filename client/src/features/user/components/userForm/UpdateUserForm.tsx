import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";
import { queryKey } from "../../user.constants";
import type { User } from "../../user.type";
import type { UpdateUserDto } from "../../user.dto";
import { UpdateUserSchema } from "../../user.schema";
import { updateUser } from "../../api/user.service";

export default function UpdateUserForm({ item }: { item: User }) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const params: UpdateUserDto["params"] = { userId: item.id };

  const config: FormProps<UpdateUserDto["body"], User> = {
    inputs: [
      {
        name: "isActive",
        type: "switch",
        label: "حالة النشاط",
      },
      {
        name: "name",
        type: "text",
        label: "الاسم",
        placeholder: "اسم المستخدم",
        col: "half",
      },
      {
        name: "phone",
        type: "text",
        label: "رقم الهاتف",
        placeholder: "01xxxxxxxxx",
        col: "half",
      },
    ],

    defaultValues: {
      name: item.name,
      phone: item.phone,
      isActive: item.isActive,
    },

    schema: UpdateUserSchema.body,

    submitButton: {
      text: "حفظ التعديلات",
      
    },

    service: (data) => updateUser({ body: data, params }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("تم تعديل بيانات المستخدم بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
