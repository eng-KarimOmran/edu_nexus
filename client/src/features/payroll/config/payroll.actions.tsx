import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  RiDeleteBin6Line,
  type RemixiconComponentType,
} from "@remixicon/react";

import { useDialogState } from "@/store/DialogState";

import type { Payroll } from "../payroll.type";

import DeletePayrollForm from "../components/formsPayroll/DeletePayrollForm";

type ActionType = "delete";

interface Action {
  title: string;
  icon: RemixiconComponentType;
  type: ActionType;
}

export default function ActionsPayroll({ item }: { item: Payroll }) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const actions: Action[] = [
    {
      title: "حذف",
      icon: RiDeleteBin6Line,
      type: "delete",
    },
  ];

  const handleAction = (type: ActionType) => {
    switch (type) {
      case "delete":
        setConfigDialog({
          title: "حذف كشف الراتب",
          description: "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.",
          children: <DeletePayrollForm id={item.id} />,
        });
        break;
    }
  };

  return (
    <>
      {actions.map((action) => (
        <DropdownMenuItem
          key={action.type}
          onSelect={(e) => {
            e.preventDefault();
            handleAction(action.type);
          }}
        >
          <action.icon className="ml-2 h-4 w-4" />
          <span>{action.title}</span>
        </DropdownMenuItem>
      ))}
    </>
  );
}
