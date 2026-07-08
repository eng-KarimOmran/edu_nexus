import type { FormProps } from "@/components/Form/Form";
import { useDialogState } from "@/store/DialogState";
import { NewPasswordSchema } from "../../user.schema";
import { toast } from "sonner";
import Form from "@/components/Form/Form";
import type { NewPasswordDto } from "../../user.dto";
import type { User } from "../../user.type";
import { setNewPassword } from "../../api/user.service";

export default function NewPasswordForm({userId}:{userId: string}) {
  const { setConfigDialog } = useDialogState();

  const params: NewPasswordDto["params"] = {
    userId,
  };

  const config: FormProps<NewPasswordDto["body"], User> = {
    inputs: [
      {
        name: "newPassword",
        type: "password",
        label: "كلمة المرور الجديده",
        placeholder: "********",
      },
    ],

    schema: NewPasswordSchema.body,

    submitButton: {
      text: "إضافة المستخدم",
      
    },

    service: (data) => setNewPassword({ body: data, params }),

    onSuccess: () => {
      toast.success("تم تعديل كلمة مرور المستخدم بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
