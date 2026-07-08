import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import {
  RiDeleteBin6Line,
  RiEditLine,
  RiExternalLinkLine,
  RiPhoneLine,
  RiWhatsappLine,
  type RemixiconComponentType,
} from "@remixicon/react";

import { useNavigate } from "react-router-dom";

import { useDialogState } from "@/store/DialogState";

import { ROUTE_BUILDERS } from "@/routes/routes.builders";

import { contactLink, whatsappLink } from "@/lib/phoneLinks";

import type { Client } from "../client.type";

import UpdateClientForm from "../components/clientForm/UpdateClientForm";
import DeleteClientForm from "../components/clientForm/DeleteClientForm";

type ActionType = "details" | "update" | "delete" | "phone-call" | "whatsapp";

interface Action {
  title: string;
  icon: RemixiconComponentType;
  type: ActionType;
}

export default function ActionsClient({
  academyId,
  item,
}: {
  academyId?: string;
  item: Client;
}) {
  const navigate = useNavigate();
  const { setConfigDialog } = useDialogState();

  if (!academyId) return null;

  const actions: Action[] = [
    {
      title: "مكالمة",
      icon: RiPhoneLine,
      type: "phone-call",
    },
    {
      title: "واتساب",
      icon: RiWhatsappLine,
      type: "whatsapp",
    },
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
        navigate(ROUTE_BUILDERS.clientDetails(academyId, item.id));
        break;

      case "update":
        setConfigDialog({
          title: "تعديل العميل",
          description: "قم بتعديل بيانات العميل.",
          children: <UpdateClientForm academyId={academyId} item={item} />,
        });
        break;

      case "delete":
        setConfigDialog({
          title: "حذف العميل",
          description: "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.",
          children: <DeleteClientForm academyId={academyId} item={item} />,
        });
        break;

      case "phone-call":
        contactLink(item.phone);
        break;

      case "whatsapp":
        whatsappLink(item.phone);
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
