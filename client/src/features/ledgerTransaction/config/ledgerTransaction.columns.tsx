import type { Header } from "@/components/Table/HeaderTable";
import ShowMore from "@/components/ShowMore/ShowMore";
import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";

import { enumTranslations } from "@/lib/enumTranslations";
import { formatDate } from "@/lib/formatDate";

import { Button } from "@/components/ui/button";
import type { WalletMovement } from "../ledgerTransaction.type";

export const columns: Header<WalletMovement>[] = [
  {
    key: "id",
    header: "المعرف",
    display: (data) => <ShowMore text={data.id} columns={6} />,
  },

  {
    key: "transactionType",
    header: "نوع العملية",
    display: (data) => enumTranslations[data.transactionType],
  },

  {
    key: "paymentMethod",
    header: "طريقة الدفع",
    display: (data) => enumTranslations[data.paymentMethod],
  },

  {
    key: "amount",
    header: "المبلغ",
    display: (data) => data.amount,
  },

  {
    key: "walletMovementStatus",
    header: "الحالة",
    display: (data) => (
      <BadgeDemo
        type={data.walletMovementStatus}
        text={enumTranslations[data.walletMovementStatus]}
      />
    ),
  },

  {
    key: "paymentProofImage",
    header: "اثبات الدفع",
    display: (data) =>
      data?.paymentProofImage ? (
        <Button asChild variant={"link"}>
          <a
            href={data.paymentProofImage.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            اثبات الدفع
          </a>
        </Button>
      ) : (
        "-"
      ),
  },

  {
    key: "createdAt",
    header: "تاريخ العملية",
    display: (data) => formatDate(data.createdAt, "date"),
  },
];
