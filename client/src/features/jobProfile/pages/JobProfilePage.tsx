import TableUi, { type DataTableProps } from "@/components/Table/TableUi";
import PageHeader, {
  type PageHeaderProps,
} from "@/components/PageHeader/PageHeader";

import { useJobProfiles } from "../api/jobProfile.query";

import type { JobProfile } from "../jobProfile.type";

import { columns } from "../config/jobProfile.columns";
import { filters } from "../config/jobProfile.filters";
import ActionsJobProfile from "../config/jobProfile.actions";
import AddJobProfileForm from "../components/jobProfileForm/AddJobProfileForm";

export default function JobProfilePage() {
  const { data, isFetching, isLoading } = useJobProfiles();

  const tableProps: DataTableProps<JobProfile> = {
    data: data?.items ?? [],
    maxPage: data?.pagination.totalPages ?? 1,

    isLoading,
    isFetching,

    headers: columns,

    actions: (item) => <ActionsJobProfile item={item} />,

    filters,

    ButtonAddTable: {
      configDialog: {
        title: "إضافة وظيفة جديدة",
        description: "قم بإدخال بيانات الوظيفة.",
        children: <AddJobProfileForm />,
      },
      textBtn: "اضف ملف وظيفي",
    },
  };

  const headerProps: PageHeaderProps = {
    title: "إدارة الوظائف",
    description: "عرض وإدارة جميع الوظائف داخل الأكاديمية.",
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-sidebar rounded-md p-4">
        <PageHeader {...headerProps} />
      </div>

      <TableUi {...tableProps} />
    </section>
  );
}
