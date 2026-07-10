import type { RemixiconComponentType } from "@remixicon/react";
import CopyBtn from "../CopyBtn/CopyBtn";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { ReactNode } from "react";

type BasicInfoItem = {
  key: string;
  title: string;
  content: ReactNode;
  icon?: RemixiconComponentType;
  copyButton?: boolean;
};

type Header = {
  title: string;
  actions?: ReactNode;
};

export interface DisplayDetailsProps {
  header?: Header;
  basicInfo: {
    title?: string;
    data: BasicInfoItem[];
  };
  children?: ReactNode;
}

export default function DisplayDetails({
  basicInfo,
  header,
  children,
}: DisplayDetailsProps) {
  return (
    <section className="space-y-6 p-1">
      {header && (
        <header className="flex flex-col gap-4 border p-4 rounded-lg md:flex-row justify-between md:items-center">
          <div>{header.title}</div>
          {header.actions && header.actions}
        </header>
      )}
      <main className="bg-sidebar p-4 rounded-lg space-y-3">
        <h2 className="text-xl font-bold">
          {basicInfo.title ?? "البيانات الأساسية"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {basicInfo.data.map((item) => (
            <Card key={item.key} className="shadow">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="me-auto">{item.title}</CardTitle>
                {item.icon && (
                  <item.icon className="text-primary/70 group-hover:text-primary" />
                )}
              </CardHeader>
              <CardContent className="flex justify-between items-center p-1">
                <div className="font-semibold break-all p-1 w-full">
                  {item.content}
                </div>
                {item.copyButton && typeof item.content === "string" && (
                  <CopyBtn text={item.content} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {children && <>{children}</>}
      </main>
    </section>
  );
}
