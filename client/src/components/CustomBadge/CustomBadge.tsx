import { Badge } from "@/components/ui/badge";

import {
  WalletMovementStatus,
  LessonStatus,
  SubscriptionStatus,
} from "@/types/enums";

type Status =
  | LessonStatus
  | WalletMovementStatus
  | SubscriptionStatus
  | "TRUE"
  | "FALSE";

const statusVariant: Record<Status, "success" | "warning" | "destructive"> = {
  // Lesson Status
  [LessonStatus.SCHEDULED]: "warning",
  [LessonStatus.COMPLETED]: "success",
  [LessonStatus.CANCELED]: "destructive",
  [LessonStatus.CANCELED_CHARGED]: "destructive",

  // Ledger Transaction Status
  [WalletMovementStatus.PENDING]: "warning",
  [WalletMovementStatus.APPROVED]: "success",
  [WalletMovementStatus.REJECTED]: "destructive",

  // Subscription Status
  [SubscriptionStatus.PENDING_DEPOSIT]: "warning",
  [SubscriptionStatus.PENDING_FIRST_SESSION]: "warning",
  [SubscriptionStatus.GRACE_PERIOD]: "warning",
  [SubscriptionStatus.SUSPENDED]: "destructive",
  [SubscriptionStatus.ACTIVE]: "success",
  [SubscriptionStatus.FULLY_BOOKED]: "warning",

  // Boolean
  TRUE: "success",
  FALSE: "destructive",
};

interface BadgeDemoProps {
  type: Status;
  text?: string;
}

export function BadgeDemo({ type, text }: BadgeDemoProps) {
  return <Badge variant={statusVariant[type]}>{text ?? type}</Badge>;
}
