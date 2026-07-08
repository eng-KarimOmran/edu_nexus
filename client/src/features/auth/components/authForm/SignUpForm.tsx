import Form, { type FormProps } from "@/components/Form/Form";

import { signup } from "../../api/auth.service";
import type { createFirstUserDto } from "../../auth.dto";
import { createFirstUserSchema } from "../../auth.schema";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUpForm() {
  const navigate = useNavigate();

  const config: FormProps<createFirstUserDto["body"], null> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: "الاسم",
        placeholder: "مثال: محمد احمد",
      },
      {
        name: "phone",
        type: "tel",
        label: "رقم الهاتف",
        placeholder: "01xxxxxxxxx",
      },
    ],

    schema: createFirstUserSchema.body,

    submitButton: {
      text: "تسجيل",
      
    },

    service: (data) => signup({ body: data }),

    onSuccess: () => {
      navigate(`/`, { replace: true });
      toast.success("تم تسجيل المستخدم بنجاح");
    },
  };

  return <Form {...config} />;
}
