import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";

import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";
import { LogoutSchema } from "../../auth.schema";
import { logout } from "../../api/auth.service";
import type { LogoutDto } from "../../auth.dto";
import { useUserProfileState } from "@/store/UserDetailsState";
import { useNavigate } from "react-router-dom";

export default function LogoutForm() {
  const { setUserProfile } = useUserProfileState();
  const navigate = useNavigate();
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const config: FormProps<LogoutDto["query"], null> = {
    inputs: [
      {
        name: "allDevices",
        type: "switch",
        label: "تسجيل الخروج من جميع الأجهزة",
      },
    ],

    defaultValues: {
      allDevices: false,
    },

    schema: LogoutSchema["query"],

    submitButton: {
      text: "تأكيد الخروج",

      variant: "destructive",
    },

    service: (params) => {
      return logout({ query: params });
    },

    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      setConfigDialog(null);
      setUserProfile(null);
      navigate("/");
    },
  };

  return <Form {...config} />;
}
