import { TableCell, TableRow } from "../ui/table";

export default function NoDataTable({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-10">
        لا يوجد بيانات لعرضها
      </TableCell>
    </TableRow>
  );
}
