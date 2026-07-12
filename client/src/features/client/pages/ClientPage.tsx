import TableUi, { type DataTableProps } from "@/components/Table/TableUi";
import PageHeader, {
  type PageHeaderProps,
} from "@/components/PageHeader/PageHeader";

import { useActiveAcademyState } from "@/store/ActiveAcademyState";

import { useClients } from "../api/client.query";

import type { Client } from "../client.type";

import { columns } from "../config/client.columns";
import { filters } from "../config/client.filters";
import ActionsClient from "../config/client.actions";

import AddClientForm from "../components/clientForm/AddClientForm";

export default function ClientPage() {
  const { activeAcademy } = useActiveAcademyState.getState();

  const academyId = activeAcademy?.id;

  const { data, isLoading, isFetching } = useClients(academyId);

  const tableProps: DataTableProps<Client> = {
    data: data?.items ?? [],

    maxPage: data?.pagination.totalPages ?? 1,

    isLimit: true,
    isSearch: true,
    isPagination: true,

    isLoading,
    isFetching,

    headers: columns,

    filters,

    actions: (item) => <ActionsClient academyId={academyId} item={item} />,

    ButtonAddTable: {
      configDialog: {
        title: "إضافة عميل جديد",
        description: "قم بإدخال بيانات العميل.",
        children: <AddClientForm />,
      },
      textBtn: "اضف عميل",
    },
  };

  const headerProps: PageHeaderProps = {
    title: "إدارة العملاء",
    description: "عرض وإدارة جميع العملاء داخل الأكاديمية.",
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
