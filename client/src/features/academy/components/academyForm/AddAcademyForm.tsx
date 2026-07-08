import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";
import { queryClient } from "@/lib/queryClient";
import { useDialogState } from "@/store/DialogState";
import { toast } from "sonner";
import type { CreateAcademyDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";
import { createAcademy } from "../../api/academy.service";
import { queryKey } from "../../academy.constants";
import { AcademySchema } from "../../academy.schema";
import { useUsers } from "@/features/user/api/user.query";
import { useUserProfileState } from "@/store/UserDetailsState";
import { refresh } from "@/features/auth/api/auth.service";

export default function AddAcademyForm() {
  const { setConfigDialog } = useDialogState();
  const { setUserProfile } = useUserProfileState();

  const { data, isLoading, error } = useUsers({
    isActive: true,
    page: 1,
    limit: 100,
  });

  const config: FormProps<CreateAcademyDto["body"], Academy> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: "اسم الأكاديمية",
        placeholder: "اكتب اسم الأكاديمية",
      },
      {
        name: "phone",
        type: "tel",
        label: "رقم تواصل الأكاديمية",
        placeholder: "01xxxxxxxxx :مثال",
        col: "half",
      },
      {
        name: "userId",
        type: "select",
        label: "اختار مالك الأكادمية",
        placeholder: isLoading
          ? "جاري تحميل المستخدمين..."
          : data?.items.length
            ? "اختار المستخدم"
            : "لا يوجد مستخدمين",
        col: "half",
        options: data?.items.map((u) => ({
          label: `${u.name.split(" ")[0]}-${u.phone}`,
          value: u.id,
        })),
        disabled: isLoading || !!error,
      },
    ],
    submitButton: {
      text: "اضافة الأكادمية",
    },
    schema: AcademySchema.create.body,
    service: (data) => createAcademy({ body: data }),
    onSuccess: async () => {
      toast.success("تم اضافة الأكادمية بنجاح");
      queryClient.invalidateQueries({ queryKey });
      setConfigDialog(null);
      try {
        const res = await refresh();
        setUserProfile(res.data.data.user);
      } catch {
        setUserProfile(null);
      }
    },
  };
  return <Form {...config} />;
}