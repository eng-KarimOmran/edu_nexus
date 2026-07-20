import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  RiDeleteBin6Line,
  RiEditLine,
  RiExternalLinkLine,
  type RemixiconComponentType,
} from "@remixicon/react";

import { useNavigate } from "react-router-dom";
import { useDialogState } from "@/store/DialogState";
import type { Academy } from "../academy.type";
import DeleteAcademyForm from "../components/academyForm/DeleteAcademyForm";
import UpdateAcademyForm from "../components/academyForm/UpdateAcademyForm";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";

type ActionType = "update" | "delete" | "details";

interface Action {
  title: string;
  icon: RemixiconComponentType;
  type: ActionType;
}

export default function ActionsAcademy({ item }: { item: Academy }) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);
  const navigate = useNavigate();

  const actions: Action[] = [
    { title: "التفاصيل", icon: RiExternalLinkLine, type: "details" },
    { title: "تعديل", icon: RiEditLine, type: "update" },
    { title: "حذف", icon: RiDeleteBin6Line, type: "delete" },
  ];

  const handleAction = (type: ActionType) => {
    switch (type) {
      case "details":
        navigate(ROUTE_BUILDERS.academyDetails(item.id));
        break;
      case "update":
        setConfigDialog({
          title: "تعديل بيانات الأكاديمية",
          description: "قم بتعديل البيانات المطلوبة ثم اضغط حفظ.",
          children: <UpdateAcademyForm item={item} />,
        });
        break;
      case "delete":
        setConfigDialog({
          title: "حذف الأكاديمية",
          description: "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.",
          children: <DeleteAcademyForm item={item} />,
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
