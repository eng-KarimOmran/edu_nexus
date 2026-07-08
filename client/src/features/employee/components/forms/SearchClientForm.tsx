import Form, { type FormProps } from "@/components/Form/Form";

import { getClient } from "../../api/employee.service";

import type { Client } from "@/features/client/client.type";
import type { GetClientDto } from "../../employee.dto";
import { getClientSchema } from "../../employee.schema";
import { useNavigate } from "react-router-dom";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";

export default function SearchClientForm() {
  const navigate = useNavigate();
  const config: FormProps<GetClientDto["query"], Client> = {
    inputs: [
      {
        name: "search",
        type: "text",
        label: "بحث",
        placeholder: "ابحث عن العميل بالمعرف او رقم الهاتف...",
      },
    ],

    schema: getClientSchema.query,

    submitButton: {
      text: "بحث",
    },

    service: (query) => getClient({ query }),

    onSuccess: (data) => {
      if ("data" in data) {
        navigate(
          ROUTE_BUILDERS.clientDetails(data.data.academyId, data.data.id),
        );
      }
    },
  };

  return <Form {...config} />;
}
