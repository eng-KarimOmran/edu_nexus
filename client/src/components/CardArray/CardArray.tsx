import type { ReactNode } from "react";

interface CardArrayProps {
  data: { label: string; val: ReactNode }[];
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
}
export default function CardArray({
  data,
  title,
  children,
  icon,
}: CardArrayProps) {
  return (
    <div className="bg-muted/10 dark:bg-muted/50 border rounded-xl shadow overflow-hidden">
      <header className="bg-muted p-4 text-md font-bold flex justify-start gap-2 items-center">
        {icon}
        <span>{title}</span>
      </header>
      <main>
        <ul>
          {data.map((i) => (
            <li key={i.label} className="flex justify-between items-center p-3">
              <div className="text-muted-foreground">{i.label} :</div>
              <div>{i.val}</div>
            </li>
          ))}
        </ul>
        {children}
      </main>
    </div>
  );
}
