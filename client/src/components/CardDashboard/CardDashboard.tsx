import type { ReactNode } from "react";

export default function CardDashboard({
  title,
  value,
  subtext,
  icon,
}: {
  title: string;
  value: string | number;
  subtext: string | number;
  icon: ReactNode;
}) {
  return (
    <div className="p-6 flex justify-between items-center shadow border rounded-2xl bg-card group">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </div>
      <div className="p-3 rounded-xl bg-primary/10 text-primary transition-transform duration-700 group-hover:rotate-360">
        {icon}
      </div>
    </div>
  );
}
