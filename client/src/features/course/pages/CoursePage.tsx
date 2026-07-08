import PageHeader from "@/components/PageHeader/PageHeader";
import TableUi, { type DataTableProps } from "@/components/Table/TableUi";

import { useActiveAcademyState } from "@/store/ActiveAcademyState";

import { useCourses } from "../api/course.query";

import { columns } from "../config/course.columns";
import { filters } from "../config/course.filters";
import ActionsCourse from "../config/course.actions";

import AddCourseForm from "../components/courseForm/AddCourseForm";

import type { Course } from "../course.type";

export default function CoursePage() {
  const academyId = useActiveAcademyState.getState().activeAcademy?.id;

  const { data, isLoading, isFetching } = useCourses({ academyId });

  const tableProps: DataTableProps<Course> = {
    data: data?.items ?? [],

    maxPage: data?.pagination.totalPages ?? 1,

    headers: columns,

    filters,

    isLimit: true,
    isSearch: true,
    isPagination: true,

    isLoading,
    isFetching,

    actions: (item) => <ActionsCourse academyId={academyId} item={item} />,

    ButtonAddTable: {
      configDialog: {
        title: "إضافة برنامج",
        description: "قم بإدخال بيانات البرنامج.",
        children: <AddCourseForm />,
      },
    },
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-sidebar rounded-md p-4">
        <PageHeader
          title="إدارة البرامج"
          description="إدارة جميع برامج التدريب."
        />
      </div>

      <TableUi {...tableProps} />
    </section>
  );
}
