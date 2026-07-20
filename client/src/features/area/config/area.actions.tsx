import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import {
  RiDeleteBin6Line,
  RiEditLine,
  RiExternalLinkLine,
  type RemixiconComponentType,
} from "@remixicon/react";

import { useNavigate } from "react-router-dom";

import { useDialogState } from "@/store/DialogState";

import { ROUTE_BUILDERS } from "@/routes/routes.builders";

import type { Area } from "../area.type";

import UpdateAreaForm from "../components/areaForm/UpdateAreaForm";
import DeleteAreaForm from "../components/areaForm/DeleteAreaForm";

type ActionType = "details" | "update" | "delete";

interface Action {
  title: string;
  icon: RemixiconComponentType;
  type: ActionType;
}

export default function ActionsArea({ item }: { item: Area }) {
  const navigate = useNavigate();

  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  const actions: Action[] = [
    {
      title: "التفاصيل",
      icon: RiExternalLinkLine,
      type: "details",
    },
    {
      title: "تعديل",
      icon: RiEditLine,
      type: "update",
    },
    {
      title: "حذف",
      icon: RiDeleteBin6Line,
      type: "delete",
    },
  ];

  const handleAction = (type: ActionType) => {
    switch (type) {
      case "details":
        navigate(ROUTE_BUILDERS.areaDetails(item.id));
        break;

      case "update":
        setConfigDialog({
          title: "تعديل المنطقة",
          description: "قم بتعديل بيانات المنطقة.",
          children: <UpdateAreaForm item={item} />,
        });
        break;

      case "delete":
        setConfigDialog({
          title: "حذف المنطقة",
          description: "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.",
          children: <DeleteAreaForm item={item} />,
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
