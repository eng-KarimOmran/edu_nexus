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

import type { JobProfile } from "../jobProfile.type";
import UpdateJobProfileForm from "../components/jobProfileForm/UpdateJobProfileForm";
import DeleteJobProfileForm from "../components/jobProfileForm/DeleteJobProfileForm";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";
import { contactLink, whatsappLink } from "@/lib/phoneLinks";

type ActionType = "update" | "delete" | "details" | "phone-call" | "whatsapp";

interface Action {
  title: string;
  icon: RemixiconComponentType;
  type: ActionType;
}

export default function ActionsJobProfile({ item }: { item: JobProfile }) {
  const setConfigDialog = useDialogState((state) => state.setConfigDialog);
  const navigate = useNavigate();

  const actions: Action[] = [
    {
      title: "مكالمة",
      icon: RiPhoneLine,
      type: "phone-call",
    },
    { title: "واتساب", icon: RiWhatsappLine, type: "whatsapp" },
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
        navigate(ROUTE_BUILDERS.jobProfileDetails(item.id));
        break;

      case "update":
        setConfigDialog({
          title: "تعديل الوظيفة",
          description: "قم بتعديل البيانات المطلوبة ثم اضغط حفظ.",
          children: <UpdateJobProfileForm item={item} />,
        });
        break;

      case "delete":
        setConfigDialog({
          title: "حذف الوظيفة",
          description: "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.",
          children: <DeleteJobProfileForm item={item} />,
        });
        break;
      case "phone-call":
        contactLink(item.user.phone);
        break;
      case "whatsapp":
        whatsappLink(item.user.phone);
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
