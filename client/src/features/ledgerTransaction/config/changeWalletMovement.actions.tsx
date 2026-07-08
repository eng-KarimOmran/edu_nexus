import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import {
  RiCheckLine,
  RiCloseLine,
  RiExternalLinkLine,
  type RemixiconComponentType,
} from "@remixicon/react";

import { useNavigate } from "react-router-dom";

import { useDialogState } from "@/store/DialogState";

import { ROUTE_BUILDERS } from "@/routes/routes.builders";

import type { WalletMovement } from "../ledgerTransaction.type";

import { WalletMovementStatus } from "@/types/enums";
import ChangeWalletMovementStatusForm from "../components/ledgerTransactionForm/ChangeLedgerTransactionStatusForm";

type ActionType = "details" | "APPROVED" | "REJECTED";

interface Action {
  title: string;
  icon: RemixiconComponentType;
  type: ActionType;
}

export default function ActionsLedgerTransaction({
  academyId,
  item,
}: {
  academyId?: string;
  item: WalletMovement;
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
      title: "قبول",
      icon: RiCheckLine,
      type: "APPROVED",
    },
    {
      title: "رفض",
      icon: RiCloseLine,
      type: "REJECTED",
    },
  ];

  const openStatusDialog = (status: WalletMovementStatus, title: string) => {
    setConfigDialog({
      title,
      description: "تغيير حالة العملية.",

      children: (
        <ChangeWalletMovementStatusForm
          academyId={academyId}
          ledgerTransactionId={item.id}
          status={status}
        />
      ),
    });
  };

  const handleAction = (type: ActionType) => {
    switch (type) {
      case "details":
        navigate(ROUTE_BUILDERS.transactionDetails(academyId, item.id));
        break;

      case "APPROVED":
        openStatusDialog(WalletMovementStatus.APPROVED, "قبول العملية");
        break;

      case "REJECTED":
        openStatusDialog(WalletMovementStatus.REJECTED, "رفض العملية");
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
          disabled={action.type === item.walletMovementStatus}
        >
          <action.icon className="ml-2 h-4 w-4" />
          <span>{action.title}</span>
        </DropdownMenuItem>
      ))}
    </>
  );
}
