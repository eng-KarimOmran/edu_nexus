import { type ReactNode } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import HeaderTable, { type Header } from "./HeaderTable";
import LoadingTable from "./LoadingTable";
import ActionTable from "./ActionTable";
import NoDataTable from "./NoDataTable";
import SearchInput from "./SearchInput";
import Pagination from "./Pagination";
import { Spinner } from "../ui/spinner";
import TableLimitSelector from "./TableLimitSelector";
import TableFilter, { type TableFilterProps } from "./TableFilter";
import { useSearchParams } from "react-router-dom";
import type { ButtonAddProps } from "./ButtonAdd";
import ButtonAdd from "./ButtonAdd";

export type DataTableProps<T> = {
  data?: T[];
  maxPage?: number;
  headers: Header<T>[];
  isSearch?: boolean;
  isPagination?: boolean;
  actions?: (item: T) => ReactNode;
  ButtonAddTable?: ButtonAddProps;
  isLoading?: boolean;
  isFetching?: boolean;
  filters?: TableFilterProps["data"];
  isLimit?: boolean;
};

export default function TableUi<T>({
  data = [],
  headers,
  isLoading,
  isFetching,
  actions,
  ButtonAddTable,
  maxPage = 1,
  filters,
  isPagination,
  isSearch,
  isLimit,
}: DataTableProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const colSpan = headers.length + (actions ? 1 : 0);

  return (
    <div className="rounded-md border bg-muted/50 p-2">
      <div className="py-2 flex justify-between items-start md:items-center flex-col gap-2 md:flex-row">
        {ButtonAddTable && <ButtonAdd {...ButtonAddTable} />}
        {isSearch && (
          <div className="flex items-center gap-1 w-full max-w-sm">
            <SearchInput
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
            {!isLoading && isFetching && <Spinner />}
          </div>
        )}
        <div className="flex justify-end items-start md:items-center gap-1 flex-1">
          {isLimit && (
            <TableLimitSelector
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          )}
          {filters && (
            <TableFilter
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              data={filters}
            />
          )}
        </div>
      </div>
      <Table>
        <HeaderTable headers={headers} hasActions={!!actions} />
        <TableBody>
          {isLoading ? (
            <LoadingTable colSpan={headers.length + 1} />
          ) : data && data.length > 0 ? (
            data.map((item, i) => (
              <TableRow key={`item-${i}`}>
                {actions && (
                  <TableCell>
                    <ActionTable>{actions(item)}</ActionTable>
                  </TableCell>
                )}
                {headers.map((header, colIndex) => (
                  <TableCell key={colIndex} className="font-medium">
                    {header.display
                      ? header.display(item)
                      : (item[header.key] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <NoDataTable colSpan={colSpan} />
          )}
        </TableBody>
      </Table>
      {isPagination && data.length > 0 && <Pagination maxPage={maxPage} />}
    </div>
  );
}
