import { queryKey } from "@/features/ledgerTransaction/ledgerTransaction.constants";
import { useQuery } from "@tanstack/react-query";
import { getMyDebts } from "../api/employee.service";
import { LoadingCards } from "@/components/Loading/Loading";
import displayError from "@/lib/displayError";
import type { DisplayDetailsProps } from "@/components/DisplayDetails/DisplayDetails";
import { RiSchoolFill } from "@remixicon/react";
import DisplayDetails from "@/components/DisplayDetails/DisplayDetails";
import { useUserProfileState } from "@/store/UserDetailsState";

export default function MyDebtsPage() {
  const { userProfile } = useUserProfileState();

  const {
    isLoading,
    data = [],
    error,
  } = useQuery({
    queryKey: [queryKey, "my-debts"],
    queryFn: () => getMyDebts(),
    select: (res) => res.data.data,
    enabled: !!userProfile?.jobProfile,
  });

  if (isLoading) {
    return <LoadingCards count={4} />;
  }

  if (error) {
    displayError({ error, mes: "حدث خطأ اثناء جلب المديونية" });
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500" dir="rtl">
        لا توجد مديونيات حاليًا
      </div>
    );
  }

  const displayConfigWallets: DisplayDetailsProps = {
    basicInfo: {
      title: "بيانات الديون في الأكاديميات",
      data: data.map((w) => ({
        key: "academy",
        title: `اكاديمية ${w.academy.name}`,
        content: (
          <span className="text-red-600">
            {Math.abs(w.balance).toLocaleString("ar-EG")} ج.م
          </span>
        ),
        icon: RiSchoolFill,
      })),
    },
  };

  return <DisplayDetails {...displayConfigWallets} />;
}