import { getAllUsers } from "@/features/user/api/user.service";
import { useDialogState } from "@/store/DialogState";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import type { AddOwnerDto } from "../../academy.dto";
import type { Academy } from "../../academy.type";
import type { FormProps } from "@/components/Form/Form";
import { AcademySchema } from "../../academy.schema";
import { addOwner } from "../../api/academy.service";
import { queryClient } from "@/lib/queryClient";
import Form from "@/components/Form/Form";
import { queryKey } from "../../academy.constants";
import displayError from "@/lib/displayError";

export default function AddOwnerForm({
  academyId,
  ownersId,
}: {
  academyId: string;
  ownersId: string[];
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", "active"],
    queryFn: () =>
      getAllUsers({
        query: {
          page: 1,
          limit: 100,
          isActive: true,
        },
      }),
    select: (res) => res.data.data,
  });

  const users = data?.items.filter((u) => !ownersId.includes(u.id)) ?? [];

  useEffect(() => {
    if (error) {
      displayError({ error, mes: "خطأ في تحميل المستخدمين" });
    }
  }, [error]);

  const config: FormProps<AddOwnerDto["params"], Academy> = {
    inputs: [
      {
        name: "userId",
        type: "select",
        label: "اختار المستخدم",
        placeholder: isLoading ? "جاري تحميل المستخدمين" : "اختار المستخدم",
        options: users.map((u) => ({
          label: `${u.name}-${u.phone}`,
          value: u.id,
        })),
      },
    ],
    submitButton: {
      text: "اضافة المالك",
    },
    schema: AcademySchema.owner.add.params,
    defaultValues: {
      academyId,
    },
    service: (data) => addOwner({ params: data }),
    onSuccess: () => {
      toast.success("تم اضافة المالك بنجاح");
      queryClient.invalidateQueries({ queryKey: [...queryKey, academyId] });
      setConfigDialog(null);
    },
  };
  return <Form {...config} />;
}
