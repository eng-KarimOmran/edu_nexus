import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  RiDeleteBin6Line,
  RiEditLine,
  RiExternalLinkLine,
  RiLockPasswordFill,
  RiPhoneLine,
  RiWhatsappLine,
  type RemixiconComponentType,
} from "@remixicon/react";
import { useDialogState } from "@/store/DialogState";
import { useNavigate } from "react-router-dom";
import type { User } from "../user.type";
import UpdateUserForm from "../components/userForm/UpdateUserForm";
import DeleteUserForm from "../components/userForm/DeleteUserForm";
import { contactLink, whatsappLink } from "@/lib/phoneLinks";
import NewPasswordForm from "../components/userForm/NewPasswordForm";
import { ROUTE_BUILDERS } from "@/routes/routes.builders";

type ActionType =
  | "update"
  | "delete"
  | "whatsapp"
  | "phone-call"
  | "details"
  | "newPassword";

interface Action {
  title: string;
  icon: RemixiconComponentType;
  type: ActionType;
}

export default function ActionsUser({ item }: { item: User }) {
  const { setConfigDialog } = useDialogState();
  const navigate = useNavigate();

  const actions: Action[] = [
    {
      title: "مكالمة",
      icon: RiPhoneLine,
      type: "phone-call",
    },
    { title: "واتساب", icon: RiWhatsappLine, type: "whatsapp" },
    { title: "التفاصيل", icon: RiExternalLinkLine, type: "details" },

    { title: "واتساب", icon: RiWhatsappLine, type: "whatsapp" },
    { title: "تعديل", icon: RiEditLine, type: "update" },
    { title: "حذف", icon: RiDeleteBin6Line, type: "delete" },

    { title: "كلمة مرور", icon: RiLockPasswordFill, type: "newPassword" },
  ];

  const handleAction = (type: ActionType) => {
    switch (type) {
      case "update":
        setConfigDialog({
          title: "تعديل المستخدم",
          description: "قم بتعديل بيانات المستخدم ثم اضغط حفظ.",
          children: <UpdateUserForm item={item} />,
        });
        break;

      case "delete":
        setConfigDialog({
          title: "حذف المستخدم",
          description: "هل أنت متأكد من حذف المستخدم؟ لا يمكن التراجع.",
          children: <DeleteUserForm item={item} />,
        });
        break;
      case "whatsapp":
        whatsappLink(item.phone);
        break;
      case "details":
        navigate(ROUTE_BUILDERS.userDetails(item.id));
        break;
      case "phone-call":
        contactLink(item.phone);
        break;
      case "newPassword":
        setConfigDialog({
          title: "اعادة تعين كلمة مرور المستخدم",
          description: "هل أنت متأكد من اعادة تعين كلمة مرور المستخدم",
          children: <NewPasswordForm userId={item.id} />,
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
