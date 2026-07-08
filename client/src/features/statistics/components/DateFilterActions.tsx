import { useDialogState } from "@/store/DialogState";
import type { DateFormProps } from "./statisticsForm/DateForm";
import DateForm from "./statisticsForm/DateForm";
import { Button } from "@/components/ui/button";

export interface DateFilterActionsProps {
  setDate: (range: DateFormProps) => void;
  date: DateFormProps;
  initialDateFilter: DateFormProps;
}

export default function DateFilterActions({
  setDate,
  date,
  initialDateFilter,
}: DateFilterActionsProps) {
  const { setConfigDialog } = useDialogState();

  const handleClearFilter = () => {
    setDate(initialDateFilter);
  };

  const handleOpenFilterDialog = () => {
    setConfigDialog({
      title: "حدد الفترة الزمنية",
      description: "قم بتحديد الفترة الزمنية المطلوبة لعرض البيانات.",
      children: <DateForm setDate={setDate} date={date ?? initialDateFilter} />,
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={handleClearFilter}>
        مسح الفلتر
      </Button>
      <Button onClick={handleOpenFilterDialog}>تعيين فلتر</Button>
    </div>
  );
}