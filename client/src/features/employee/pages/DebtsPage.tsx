import { useQuery } from "@tanstack/react-query";
import { getEmployeesWithDebts } from "../api/employee.service";
import { queryKey } from "@/features/ledgerTransaction/ledgerTransaction.constants";
import { LoadingCards } from "@/components/Loading/Loading";
import displayError from "@/lib/displayError";
import type { DisplayDetailsProps } from "@/components/DisplayDetails/DisplayDetails";
import DisplayDetails from "@/components/DisplayDetails/DisplayDetails";
import { RiSchoolFill } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { useDialogState } from "@/store/DialogState";
import TransferFundsForm from "@/features/ledgerTransaction/components/ledgerTransactionForm/TransferFundsForm";
import type { wallets } from "../employee.type";

export default function DebtsPage() {
  const {
    isLoading,
    data = [],
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getEmployeesWithDebts(),
    select: (res) => res.data.data,
  });

  const { setConfigDialog } = useDialogState();

  if (isLoading) {
    return <LoadingCards count={3} />;
  }

  if (error) {
    displayError({ error, mes: "حدث خطأ اثناء جلب المدينية" });
  }

  const handleTransferFunds = (wallet: wallets) => {
    setConfigDialog({
      title: "تسوية المديونية",
      description: "حوّل مبلغًا من رصيد الحساب لسداد المديونية.",
      children: (
        <TransferFundsForm
          academyId={wallet.academy.id}
          amount={Math.abs(wallet.balance)}
          receiverWalletId={wallet.id}
        />
      ),
    });
  };

  const configs: DisplayDetailsProps[] = data.map((j) => ({
    basicInfo: {
      title: j.user.name,
      data: j.wallets.map((w) => ({
        key: "academy",
        title: w.academy.name,
        content: (
          <div className="space-y-4">
            <div
              className={`flex gap-1 items-center ${w.balance === 0 ? "text-green-500" : "text-red-500"}`}
            >
              <span>{Math.abs(w.balance).toLocaleString("ar-EG")}</span>{" "}
              <span>ج.م</span>
            </div>
            <Button
              onClick={() => handleTransferFunds(w)}
              disabled={!w.balance}
            >
              تسديد المديونية
            </Button>
          </div>
        ),
        icon: RiSchoolFill,
      })),
    },
  }));

  return (
    <section>
      {configs.map((config) => (
        <DisplayDetails {...config} />
      ))}
    </section>
  );
}
