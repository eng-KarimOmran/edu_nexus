import Form, { type FormProps } from "@/components/Form/Form";

import { getClient } from "../../api/employee.service";

import type { Client } from "@/features/client/client.type";
import type { GetClientDto } from "../../employee.dto";
import { getClientSchema } from "../../employee.schema";
import { useDialogState } from "@/store/DialogState";
import SubscriptionSelectionForm from "./SubscriptionSelectionForm";
import type { Transmission } from "@/types/enums";

export default function SearchClientSubscriptionForm({
  carId,
  startTime,
  gearType,
}: {
  carId: string;
  startTime: Date;
  gearType: Transmission;
}) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const config: FormProps<GetClientDto["query"], Client> = {
    inputs: [
      {
        name: "search",
        type: "tel",
        label: "رقم هاتف العميل",
        placeholder: "01000000000",
      },
    ],

    schema: getClientSchema.query,

    submitButton: {
      text: "التالي",
    },

    service: (body) => {
      let search = body.search.trim();

      if (search.length !== 25) {
        let phone = search.replace(/\D/g, "");
        const index = phone.indexOf("1");

        if (index !== -1) {
          phone = phone.slice(index);
        }

        search = "0" + phone;
      }

      return getClient({ query: { search } });
    },

    onSuccess: (data) => {
      if ("data" in data) {
        setConfigDialog({
          title: data.data.name,
          description: data.data.phone,
          children: (
            <SubscriptionSelectionForm
              carId={carId}
              startTime={startTime}
              gearType={gearType}
              academyId={data.data.academyId}
              clientSubscriptions={data.data.subscriptions}
            />
          ),
        });
      }
    },
  };

  return <Form {...config} />;
}