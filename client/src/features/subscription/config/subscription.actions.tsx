import {
  RiDeleteBin6Line,
  RiExternalLinkLine,
  RiForbidLine,
  RiUserLine,
  type RemixiconComponentType,
} from "@remixicon/react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";

import { useDialogState } from "@/store/DialogState";

import { ROUTE_BUILDERS } from "@/routes/routes.builders";

import CancelSubscriptionForm from "../components/subscriptionForm/CancelSubscriptionForm";
import DeleteSubscriptionForm from "../components/subscriptionForm/DeleteSubscriptionForm";

import type { Subscription } from "../subscription.type";

type ActionType = "details" | "client" | "cancel" | "delete";

interface Action {
  title: string;
  icon: RemixiconComponentType;
  type: ActionType;
}

export default function SubscriptionActions({
  academyId,
  item,
}: {
  academyId?: string;
  item: Subscription;
}) {
  const navigate = useNavigate();

  const { setConfigDialog } = useDialogState();

  if (!academyId) return null;

  const actions: Action[] = [
    {
      title: "التفاصيل",
      icon: RiExternalLinkLine,
      type: "details",
    },
    {
      title: "ملف العميل",
      icon: RiUserLine,
      type: "client",
    },
    {
      title: "إلغاء الاشتراك",
      icon: RiForbidLine,
      type: "cancel",
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
        navigate(ROUTE_BUILDERS.subscriptionDetails(academyId, item.id));
        break;

      case "client":
        navigate(ROUTE_BUILDERS.clientDetails(academyId, item.clientId));
        break;

      case "cancel":
        setConfigDialog({
          title: "إلغاء الاشتراك",
          description: "هل أنت متأكد؟",
          children: (
            <CancelSubscriptionForm academyId={academyId} item={item} />
          ),
        });
        break;

      case "delete":
        setConfigDialog({
          title: "حذف الاشتراك",
          description: "سيتم حذف الاشتراك نهائياً.",

          children: (
            <DeleteSubscriptionForm academyId={academyId} item={item} />
          ),
        });
        break;
    }
  };

  return actions.map((action) => (
    <DropdownMenuItem
      key={action.type}
      onSelect={(e) => {
        e.preventDefault();
        handleAction(action.type);
      }}
    >
      <action.icon className="mr-2 h-4 w-4" />
      {action.title}
    </DropdownMenuItem>
  ));
}