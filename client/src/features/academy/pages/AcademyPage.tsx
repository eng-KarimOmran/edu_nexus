import type { DataTableProps } from "@/components/Table/TableUi";
import { useAcademy } from "../api/academy.query";
import type { Academy } from "../academy.type";
import { columns } from "../config/academy.columns";
import type { PageHeaderProps } from "@/components/PageHeader/PageHeader";
import PageHeader from "@/components/PageHeader/PageHeader";
import TableUi from "@/components/Table/TableUi";
import AddAcademyForm from "../components/academyForm/AddAcademyForm";
import ActionsAcademy from "../config/academy.actions";

export default function AcademyPage() {
  const { data, isFetching, isLoading } = useAcademy();

  const configTable: DataTableProps<Academy> = {
    data: data?.items ?? [],
    maxPage: data?.pagination?.totalPages ?? 1,
    isLoading,
    isFetching,
    isLimit: true,
    isPagination: true,
    isSearch: true,
    headers: columns,
    actions: (item) => <ActionsAcademy item={item} />,
    ButtonAddTable: {
      configDialog: {
        title: "إضافة أكاديمية جديدة",
        description: "قم بإدخال بيانات الأكاديمية لإضافتها إلى النظام.",
        children: <AddAcademyForm />,
      },
    },
  };

  const configHeader: PageHeaderProps = {
    title: "إدارة الأكاديميات",
    description:
      "إدارة الأكاديميات تشمل عرض بيانات كل أكاديمية، مع إمكانية الإضافة والحذف والتعديل.",
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-sidebar p-4 rounded-md">
        <PageHeader {...configHeader} />
      </div>
      <TableUi {...configTable} />
    </section>
  );
}
