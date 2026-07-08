import { RiFileTextLine } from "@remixicon/react";
import type { RemixiconComponentType } from "@remixicon/react";

interface EmptyStateProps {
  message?: string;
  icon?: RemixiconComponentType;
}

export default function EmptyState({
  message = "لا توجد بيانات لعرضها",
  icon: Icon = RiFileTextLine,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
      <Icon size={40} className="opacity-20" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
