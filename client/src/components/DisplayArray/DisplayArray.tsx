import { RiDeleteBin2Line, RiEditBoxLine } from "@remixicon/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import ShowMore from "../ShowMore/ShowMore";
import { useIsMobile } from "@/hooks/use-mobile";
import ActionTable from "../Table/ActionTable";
import { useDialogState } from "@/store/DialogState";
import type { ReactNode } from "react";

type ActionType = "add" | "update" | "delete";

type Forms<T> = {
  add?: () => ReactNode;
  update?: (item: T) => ReactNode;
  delete?: (item: T) => ReactNode;
};

export default function DisplayArray<T>({
  data,
  title,
  titleKey,
  descKey,
  forms,
}: {
  data: T[];
  title: string;
  titleKey: keyof T;
  descKey?: keyof T;
  forms: Forms<T>;
}) {
  const { setConfigDialog } = useDialogState();
  const isMobile = useIsMobile();

  const handleAction = (type: ActionType, item?: T) => {
    switch (type) {
      case "add":
        setConfigDialog({
          title: "إضافة",
          description: "قم بإدخال البيانات المطلوبة ثم اضغط حفظ.",
          children: forms.add ? forms.add() : <></>,
        });
        break;

      case "update":
        if (!item) return;

        setConfigDialog({
          title: "تعديل",
          description: "قم بتعديل البيانات المطلوبة ثم اضغط حفظ.",
          children: forms.update && forms.update(item),
        });
        break;

      case "delete":
        if (!item) return;

        setConfigDialog({
          title: "حذف",
          description: "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.",
          children: forms.delete && forms.delete(item),
        });
        break;
    }
  };

  return (
    <section className="w-full rounded-md border bg-background shadow">
      <div className="flex justify-between items-center p-4 bg-muted/50 rounded-t-md">
        <span className="font-semibold">{title}</span>
        {forms.add && (
          <Button onClick={() => handleAction("add")}>إضافة</Button>
        )}
      </div>

      <Separator />

      <ul className="grid grid-cols-1 gap-4 p-2 md:p-4 bg-muted/20">
        {data.length > 0 ? (
          data.map((item, i) => (
            <li
              key={i}
              className="p-3 bg-card rounded-md flex justify-between items-center border"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{String(item[titleKey])}</span>

                {descKey && (
                  <span className="text-muted-foreground text-sm">
                    {isMobile ? (
                      <ShowMore text={String(item[descKey])} columns={1} />
                    ) : (
                      String(item[descKey])
                    )}
                  </span>
                )}
              </div>

              <ActionTable>
                <div className="grid gap-2">
                  {forms.update && (
                    <Button onClick={() => handleAction("update", item)}>
                      تعديل <RiEditBoxLine className="h-4 w-4" />
                    </Button>
                  )}

                  {forms.delete && (
                    <Button
                      variant="destructive"
                      onClick={() => handleAction("delete", item)}
                    >
                      حذف <RiDeleteBin2Line className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </ActionTable>
            </li>
          ))
        ) : (
          <li className="py-8 text-center text-sm text-muted-foreground border border-dashed rounded-md">
            لا توجد بيانات لعرضها حالياً.
          </li>
        )}
      </ul>
    </section>
  );
}
