import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";

import { changePasswordSchema } from "../../auth.schema";
import { changePassword } from "../../api/auth.service";
import type { ChangePasswordDto } from "../../auth.dto";

import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";
import { useUserProfileState } from "@/store/UserDetailsState";

export default function ChangePasswordForm() {
  const { setUserProfile } = useUserProfileState();
  const { setConfigDialog } = useDialogState();

  const config: FormProps<ChangePasswordDto["body"], boolean> = {
    inputs: [
      {
        name: "currentPassword",
        type: "password",
        label: "كلمة المرور الحالية",
      },
      {
        name: "newPassword",
        type: "password",
        label: "كلمة المرور الجديده",
      },
    ],

    schema: changePasswordSchema.body,

    submitButton: {
      text: "تغير كلمة المرور",
    },

    service: (data) => changePassword({ body: data }),

    onSuccess: async () => {
      toast.success("تم تغير كلمة المرور بنجاح");
      setConfigDialog(null);
      setUserProfile(null);
    },
  };

  return <Form {...config} />;
}
