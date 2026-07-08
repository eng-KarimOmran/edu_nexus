import Form from "@/components/Form/Form";
import type { FormProps } from "@/components/Form/Form";

import { matchSchema } from "@/lib/matchSchema";
import { queryClient } from "@/lib/queryClient";

import { useDialogState } from "@/store/DialogState";

import { toast } from "sonner";

import { queryKey } from "../../jobProfile.constants";

import type { DeleteJobProfileDto } from "../../jobProfile.dto";

import type { JobProfile } from "../../jobProfile.type";

import { deleteJobProfile } from "../../api/jobProfile.service";

export default function DeleteJobProfileForm({
  item,
}: {
  item: JobProfile;
}) {
  const { setConfigDialog } = useDialogState();

  const params: DeleteJobProfileDto["params"] = {
    jobProfileId: item.id,
  };

  const config: FormProps<{ name: string }, JobProfile> = {
    inputs: [
      {
        name: "name",
        type: "text",
        label: `اكتب "${item.user.name}" لتأكيد الحذف`,
        placeholder: "اكتب الاسم للتأكيد",
      },
    ],

    schema: matchSchema("name", "اسم الموظف", item.user.name),

    submitButton: {
      text: "حذف الوظيفة",
      
      variant: "destructive",
    },

    service: () => deleteJobProfile({ params }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("تم حذف الوظيفة بنجاح");
      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
