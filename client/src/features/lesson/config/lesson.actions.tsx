import {
  RiEditLine,
  RiExternalLinkLine,
  RiRefreshLine,
  type RemixiconComponentType,
} from "@remixicon/react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";

import { useDialogState } from "@/store/DialogState";

import { ROUTE_BUILDERS } from "@/routes/routes.builders";

import type { Lesson } from "../lesson.type";

import UpdateLessonForm from "../components/lessonForm/UpdateLessonForm";
import ChangeLessonStateForm from "../components/lessonForm/ChangeLessonStateForm";

type ActionType = "details" | "update" | "change-status";

interface Action {
  title: string;

  icon: RemixiconComponentType;

  type: ActionType;
}

export default function ActionsLesson({ item }: { item: Lesson }) {
  const navigate = useNavigate();

  const { setConfigDialog } = useDialogState();

  const actions: Action[] = [
    {
      title: "التفاصيل",

      icon: RiExternalLinkLine,

      type: "details",
    },

    {
      title: "تعديل",

      icon: RiEditLine,

      type: "update",
    },

    {
      title: "تغيير الحالة",

      icon: RiRefreshLine,

      type: "change-status",
    },
  ];

  const handleAction = (type: ActionType) => {
    switch (type) {
      case "details":
        navigate(ROUTE_BUILDERS.lessonDetails(item.academyId, item.id));
        break;

      case "update":
        setConfigDialog({
          title: "تعديل الحصة",

          description: "تعديل بيانات الحصة",

          children: <UpdateLessonForm academyId={item.academyId} item={item} />,
        });

        break;

      case "change-status":
        setConfigDialog({
          title: "تغيير حالة الحصة",

          description: "اختر الحالة الجديدة",

          children: (
            <ChangeLessonStateForm academyId={item.academyId} item={item} />
          ),
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
