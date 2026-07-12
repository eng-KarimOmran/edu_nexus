import TableUi, { type DataTableProps } from "@/components/Table/TableUi";
import { useUsers } from "../api/user.query";
import type { User } from "../user.type";
import { columns } from "../config/user.columns";
import ActionsUser from "../config/user.actions";
import { filters } from "../config/user.filters";
import AddUserForm from "../components/userForm/AddUserForm";
import type { PageHeaderProps } from "@/components/PageHeader/PageHeader";
import PageHeader from "@/components/PageHeader/PageHeader";

export default function UserPage() {
  const { data, isFetching, isLoading } = useUsers();

  const tableProps: DataTableProps<User> = {
    data: data?.items ?? [],
    maxPage: data?.pagination.totalPages ?? 1,
    isLoading,
    isFetching,
    isLimit: true,
    isPagination: true,
    isSearch: true,
    headers: columns,
    actions: (item) => <ActionsUser item={item} />,
    filters,
    ButtonAddTable: {
      configDialog: {
        title: "إضافة مستخدم جديد",
        description: "قم بإدخال بيانات المستخدم الجديد.",
        children: <AddUserForm />,
      },
      textBtn: "اضف مستخدم",
    },
  };

  const headerProps: PageHeaderProps = {
    title: "إدارة المستخدمين",
    description: "عرض وإدارة جميع المستخدمين المسجلين.",
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-sidebar p-4 rounded-md">
        <PageHeader {...headerProps} />
      </div>
      <TableUi {...tableProps} />
    </section>
  );
}
