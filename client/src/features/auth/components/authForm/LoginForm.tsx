import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";

import { LoginSchema } from "../../auth.schema";
import { login } from "../../api/auth.service";
import type { LoginDto } from "../../auth.dto";
import type { AuthLogin } from "../../auth.type";
import { useUserProfileState } from "@/store/UserDetailsState";

export default function LoginForm() {
  const { setUserProfile } = useUserProfileState();

  const config: FormProps<LoginDto["body"], AuthLogin> = {
    inputs: [
      {
        name: "phone",
        type: "tel",
        label: "رقم الهاتف",
        placeholder: "01xxxxxxxxx",
      },
      {
        name: "password",
        type: "password",
        label: "كلمة المرور",
      },
    ],

    schema: LoginSchema.body,

    submitButton: {
      text: "تسجيل الدخول",
    },

    service: (data) => login({ body: data }),

    onSuccess: (res) => {
      if ("data" in res) {
        setUserProfile(res.data.user);
      }
    },
  };

  return <Form {...config} />;
}
