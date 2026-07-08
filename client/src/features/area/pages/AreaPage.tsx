import TableUi, { type DataTableProps } from "@/components/Table/TableUi";

import PageHeader, {
  type PageHeaderProps,
} from "@/components/PageHeader/PageHeader";

import { useAreas } from "../api/area.query";

import type { Area } from "../area.type";

import { columns } from "../config/area.columns";
import { filters } from "../config/area.filters";
import ActionsArea from "../config/area.actions";

import AddAreaForm from "../components/areaForm/AddAreaForm";

export default function AreaPage() {
  const { data, isLoading, isFetching } = useAreas();

  const tableProps: DataTableProps<Area> = {
    data: data?.items ?? [],

    maxPage: data?.pagination.totalPages ?? 1,

    isLoading,
    isFetching,

    isSearch: true,
    isPagination: true,
    isLimit: true,

    headers: columns,

    filters,

    actions: (item) => <ActionsArea item={item} />,

    ButtonAddTable: {
      configDialog: {
        title: "إضافة منطقة",
        description: "قم بإدخال بيانات المنطقة.",
        children: <AddAreaForm />,
      },
    },
  };

  const headerProps: PageHeaderProps = {
    title: "إدارة المناطق",
    description: "عرض وإدارة جميع المناطق.",
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
