import PageHeader from "@/components/PageHeader/PageHeader";
import TableUi, { type DataTableProps } from "@/components/Table/TableUi";

import { useActiveAcademyState } from "@/store/ActiveAcademyState";

import { useLessons } from "../api/lesson.query";

import { columns } from "../config/lesson.columns";
import { filters } from "../config/lesson.filters";
import ActionsLesson from "../config/lesson.actions";

import AddLessonForm from "../components/lessonForm/AddLessonForm";

import type { Lesson } from "../lesson.type";

export default function LessonPage() {
  const academyId = useActiveAcademyState.getState().activeAcademy?.id;

  const { data, isLoading, isFetching } = useLessons(academyId);

  const tableProps: DataTableProps<Lesson> = {
    data: data?.items ?? [],

    maxPage: data?.pagination.totalPages ?? 1,

    headers: columns,

    filters,

    isLimit: true,
    isSearch: true,
    isPagination: true,

    isLoading,
    isFetching,

    actions: (item) => <ActionsLesson item={item} />,

    ButtonAddTable: {
      configDialog: {
        title: "إضافة حصة",
        description: "قم بإدخال بيانات الحصة.",
        children: academyId ? <AddLessonForm academyId={academyId} /> : null,
      },
      textBtn:"اضف حصة"
    },
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-sidebar rounded-md p-4">
        <PageHeader
          title="إدارة الحصص"
          description="إدارة جميع الحصص التدريبية."
        />
      </div>

      <TableUi {...tableProps} />
    </section>
  );
}
