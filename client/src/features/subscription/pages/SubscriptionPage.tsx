import PageHeader from "@/components/PageHeader/PageHeader";
import TableUi, { type DataTableProps } from "@/components/Table/TableUi";

import { useActiveAcademyState } from "@/store/ActiveAcademyState";

import { useSubscriptions } from "../api/subscription.query";

import { columns } from "../config/subscription.columns";
import { filters } from "../config/subscription.filters";
import SubscriptionActions from "../config/subscription.actions";

import AddSubscriptionForm from "../components/subscriptionForm/AddSubscriptionForm";

import type { Subscription } from "../subscription.type";

export default function SubscriptionPage() {
  const academyId = useActiveAcademyState.getState().activeAcademy?.id;

  const { data, isLoading, isFetching } = useSubscriptions(academyId);

  const tableConfig: DataTableProps<Subscription> = {
    data: data?.items ?? [],

    maxPage: data?.pagination.totalPages ?? 1,

    headers: columns,

    filters,

    isLoading,

    isFetching,

    isSearch: true,

    isLimit: true,

    isPagination: true,

    actions: (item) => (
      <SubscriptionActions academyId={academyId} item={item} />
    ),

    ButtonAddTable: academyId
      ? {
          configDialog: {
            title: "إضافة اشتراك",

            description: "إنشاء اشتراك جديد.",

            children: <AddSubscriptionForm academyId={academyId} />,
          },
        }
      : undefined,
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-sidebar rounded-md p-4">
        <PageHeader
          title="إدارة الاشتراكات"
          description="إدارة جميع اشتراكات العملاء."
        />
      </div>

      <TableUi {...tableConfig} />
    </section>
  );
}
