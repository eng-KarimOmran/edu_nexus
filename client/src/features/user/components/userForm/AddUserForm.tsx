import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";
import { queryKey } from "../../user.constants";
import type { CreateUserDto } from "../../user.dto";
import type { User } from "../../user.type";
import { createUser } from "../../api/user.service";
import { CreateUserSchema } from "../../user.schema";

export default function AddUserForm() {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<CreateUserDto["body"], User> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: "اسم المستخدم",
        placeholder: "مثال: أحمد محمد علي",
        col: "full",
      },
      {
        name: "phone",
        type: "text",
        label: "رقم الهاتف",
        placeholder: "01xxxxxxxxx",
        col: "full",
      },
    ],

    schema: CreateUserSchema.body,

    submitButton: {
      text: "إضافة المستخدم",
      
    },

    service: (data) => createUser({ body: data }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("تم إضافة المستخدم بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
