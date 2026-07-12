import TableUi, { type DataTableProps } from "@/components/Table/TableUi";
import PageHeader, {
  type PageHeaderProps,
} from "@/components/PageHeader/PageHeader";

import { useCars } from "../api/car.query";

import type { Car } from "../car.type";

import { columns } from "../config/car.columns";
import { filters } from "../config/car.filters";
import ActionsCar from "../config/car.actions";

import AddCarForm from "../components/carForm/AddCarForm";

export default function CarPage() {

  const { data, isLoading, isFetching } = useCars();

  const tableProps: DataTableProps<Car> = {
    data: data?.items ?? [],

    maxPage: data?.pagination.totalPages ?? 1,

    isLimit: true,
    isSearch: true,
    isPagination: true,

    isLoading,
    isFetching,

    headers: columns,

    filters: filters,

    actions: (item) => <ActionsCar item={item} />,

    ButtonAddTable: {
      configDialog: {
        title: "إضافة سيارة",
        description: "أدخل بيانات السيارة الجديدة.",
        children: <AddCarForm />,
      },
      textBtn:"أضف سيارة"
    },
  };

  const headerProps: PageHeaderProps = {
    title: "إدارة السيارات",
    description: "عرض وإدارة سيارات الأكاديمية.",
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
