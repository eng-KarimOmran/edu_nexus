import type { FormProps } from "@/components/Form/Form";
import Form from "@/components/Form/Form";
import { useDialogState } from "@/store/DialogState";
import dayjs from "dayjs";

export interface DateFormProps {
  startDate: string;
  endDate: string;
}

interface Props {
  date: DateFormProps;
  setDate: (data: DateFormProps) => void;
}

export default function DateForm({ setDate, date }: Props) {
  const { setConfigDialog } = useDialogState();

  const config: FormProps<DateFormProps, null> = {
    inputs: [
      {
        name: "startDate",
        type: "date",
        label: "من",
        placeholder: "ادخل تاريخ البداية",
        col: "half",
      },
      {
        name: "endDate",
        type: "date",
        label: "الى",
        placeholder: "ادخل تاريخ الانتهاء",
        col: "half",
      },
    ],
    defaultValues: {
      startDate: date.startDate,
      endDate: date.endDate,
    },
    onSuccess: (data) => {
      if (!("data" in data)) {
        const startDate = dayjs(data.startDate).startOf("day").toISOString();
        const endDate = dayjs(data.endDate).endOf("day").toISOString();
        setDate({ startDate, endDate });
        setConfigDialog(null);
      }
    },
    submitButton: { text: "تعين الفلتر" },
  };

  return <Form {...config} />;
}
