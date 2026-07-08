import { LoadingList } from "../Loading/Loading";
import { TableCell, TableRow } from "../ui/table";

export default function LoadingTable({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <LoadingList count={5} />
      </TableCell>
    </TableRow>
  );
}