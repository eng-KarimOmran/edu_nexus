import type { SetURLSearchParams } from "react-router-dom";
import Form, { type FormProps } from "../Form/Form";

export default function TableLimitSelector({
  searchParams,
  setSearchParams,
}: {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}) {
  const config: FormProps<{ limit: string }, void> = {
    inputs: [
      {
        name: "limit",
        type: "select",
        placeholder: "عدد الصفوف المعروضة",
        options: [
          { label: "10 صف", value: "10" },
          { label: "20 صف", value: "20" },
          { label: "30 صف", value: "30" },
          { label: "40 صف", value: "40" },
          { label: "50 صف", value: "50" },
        ],
        col: "full",
        onChange: (limit) => {
          const params = new URLSearchParams(searchParams);
          params.set("limit", String(limit));
          setSearchParams(params);
        },
      },
    ],
    defaultValues: {
      limit: searchParams.get("limit") ?? "10",
    },
  };

  return <Form {...config} />;
}
