import type { ReactNode } from "react";
import { TableHead, TableHeader, TableRow } from "../ui/table";

export type Header<T> = {
  header: string;
  key: keyof T;
  display: (row: T) => ReactNode;
};

interface HeaderTableProp<T> {
  headers: Header<T>[];
  hasActions: boolean;
}

export default function HeaderTable<T>({
  headers,
  hasActions,
}: HeaderTableProp<T>) {
  return (
    <TableHeader>
      <TableRow>
        {headers.map((header, i) => (
          <TableHead key={header.key.toString() + i}>{header.header}</TableHead>
        ))}
        {hasActions && <TableHead>الإجراءات</TableHead>}
      </TableRow>
    </TableHeader>
  );
}
