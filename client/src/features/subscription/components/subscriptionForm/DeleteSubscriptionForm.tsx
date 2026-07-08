import Form, { type FormProps } from "@/components/Form/Form";

import { toast } from "sonner";

import { queryClient } from "@/lib/queryClient";
import { matchSchema } from "@/lib/matchSchema";

import { useDialogState } from "@/store/DialogState";

import { deleteSubscription } from "../../api/subscription.service";
import { queryKey } from "../../subscription.constants";

import type { Subscription } from "../../subscription.type";

export default function DeleteSubscriptionForm({
  academyId,
  item,
}: {
  academyId: string;
  item: Subscription;
}) {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<{ id: string }, Subscription> = {
    inputs: [
      {
        name: "id",
        type: "text",
        label: `اكتب معرف الاشتراك للتأكيد`,
        placeholder: item.id,
      },
    ],

    schema: matchSchema("id", "المعرف", item.id),

    submitButton: {
      text: "حذف الاشتراك",
      
      variant: "destructive",
    },

    service: () =>
      deleteSubscription({
        params: {
          academyId,
          subscriptionId: item.id,
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });

      toast.success("تم حذف الاشتراك بنجاح");

      setConfigDialog(null);
    },
  };

  return <Form {...config} />;
}
