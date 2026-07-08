import type { ReactNode } from "react";

interface InfoSectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode; // إضافة خاصية الأكشن
}

export function InfoSection({ title, children, action }: InfoSectionProps) {
  return (
    <section className="bg-accent/30 p-6 rounded-xl border border-border/50 shadow-sm">
      {/* العنوان مع الزر */}
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        {/* عرض الزر إذا وُجد */}
        {action && <div>{action}</div>}
      </div>

      {/* المحتوى */}
      {children}
    </section>
  );
}
