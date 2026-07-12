import TableUi, { type DataTableProps } from "@/components/Table/TableUi";

import PageHeader, {
  type PageHeaderProps,
} from "@/components/PageHeader/PageHeader";

import { useActiveAcademyState } from "@/store/ActiveAcademyState";

import { useLedgerTransactions } from "../api/ledgerTransaction.query";

import type { WalletMovement } from "../ledgerTransaction.type";

import { columns } from "../config/ledgerTransaction.columns";
import { filters } from "../config/ledgerTransaction.filters";

import ActionsLedgerTransaction from "../config/changeWalletMovement.actions";

import AddLedgerTransactionForm from "../components/ledgerTransactionForm/AddLedgerTransactionForm";

export default function LedgerTransactionPage() {
  const { activeAcademy } = useActiveAcademyState.getState();

  const academyId = activeAcademy?.id;

  const { data, isLoading, isFetching } = useLedgerTransactions(academyId);

  const tableProps: DataTableProps<WalletMovement> = {
    data: data?.items ?? [],

    maxPage: data?.pagination.totalPages ?? 1,

    isLoading,
    isFetching,

    isSearch: true,
    isPagination: true,
    isLimit: true,

    headers: columns,

    filters,

    actions: (item) => (
      <ActionsLedgerTransaction academyId={academyId} item={item} />
    ),

    ButtonAddTable: academyId
      ? {
          configDialog: {
            title: "إضافة عملية مالية",
            description: "قم بإدخال بيانات العملية.",
            children: <AddLedgerTransactionForm academyId={academyId} />,
          },
          textBtn: "اضف مدفوعات",
        }
      : undefined,
  };

  const headerProps: PageHeaderProps = {
    title: "دفتر المعاملات",

    description: "عرض وإدارة جميع المعاملات المالية داخل الأكاديمية.",
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
