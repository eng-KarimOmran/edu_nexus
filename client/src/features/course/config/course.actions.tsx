import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import {
  RiDeleteBin6Line,
  RiEditLine,
  RiExternalLinkLine,
  type RemixiconComponentType,
} from "@remixicon/react";

import { useNavigate } from "react-router-dom";

import { useDialogState } from "@/store/DialogState";

import { ROUTE_BUILDERS } from "@/routes/routes.builders";

import type { Course } from "../course.type";

import UpdateCourseForm from "../components/courseForm/UpdateCourseForm";
import DeleteCourseForm from "../components/courseForm/DeleteCourseForm";

type ActionType = "details" | "update" | "delete";

interface Action {
  title: string;
  icon: RemixiconComponentType;
  type: ActionType;
}

export default function ActionsCourse({
  academyId,
  item,
}: {
  academyId?: string;
  item: Course;
}) {
  const navigate = useNavigate();

  const setConfigDialog = useDialogState((state) => state.setConfigDialog);

  if (!academyId) return null;

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
      title: "حذف",
      icon: RiDeleteBin6Line,
      type: "delete",
    },
  ];

  const handleAction = (type: ActionType) => {
    switch (type) {
      case "details":
        navigate(ROUTE_BUILDERS.courseDetails(academyId, item.id));
        break;

      case "update":
        setConfigDialog({
          title: "تعديل البرنامج",
          description: "قم بتعديل بيانات البرنامج.",

          children: <UpdateCourseForm academyId={academyId} item={item} />,
        });
        break;

      case "delete":
        setConfigDialog({
          title: "حذف البرنامج",
          description: "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.",

          children: <DeleteCourseForm academyId={academyId} item={item} />,
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