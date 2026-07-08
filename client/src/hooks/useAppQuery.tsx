import { useEffect } from "react";
import {
  useQuery,
  keepPreviousData,
  type QueryKey,
} from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import type { PaginatedResponse } from "@/types/axios";
import type { AxiosResponse } from "axios";
import displayError from "@/lib/displayError";

type Primitive = string | number | boolean | Date;

type Query = Record<string, Primitive> & {
  page: number;
  limit: number;
  search?: string;
};

type BassParams = {
  query: Query;
  params?: Record<string, string>;
};

export interface UseAppQueryParams<T extends BassParams, J> {
  queryKey: QueryKey;
  searchMinLength?: number;
  filters?: (keyof T["query"])[];
  enabled?: boolean;
  keepPrevious?: boolean;
  defaultLimit?: number;
  params?: Record<string, string>;
  queryFn: (params: BassParams) => Promise<AxiosResponse<PaginatedResponse<J>>>;
  staleTime?: number | "static";
}

export default function useAppQuery<T extends BassParams, J>({
  params,
  filters,
  enabled,
  queryFn,
  queryKey,
  keepPrevious,
  defaultLimit = 10,
  searchMinLength = 2,
  staleTime = Infinity,
}: UseAppQueryParams<T, J>) {
  const [searchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const limit = Math.max(10, Number(searchParams.get("limit") ?? defaultLimit));

  const search = searchParams.get("search") ?? "";

  const filtersObj = filters?.reduce<Record<string, string>>((acc, f) => {
    if (typeof f === "string") {
      const value = searchParams.get(f);
      if (value !== null) {
        acc[f] = value;
      }
    }
    return acc;
  }, {});

  const [debouncedSearch] = useDebounce(search.trim(), 500);

  const shouldSearch = debouncedSearch.length >= searchMinLength;

  const filtersKey =
    filtersObj && Object.keys(filtersObj).length
      ? JSON.stringify(
          Object.fromEntries(
            Object.entries(filtersObj).sort(([a], [b]) => a.localeCompare(b)),
          ),
        )
      : "";

  const effectiveSearch = shouldSearch ? debouncedSearch : "";

  const query = useQuery({
    queryKey: [...queryKey, filtersKey, effectiveSearch, limit, page],
    enabled,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
    select: (res) => res.data.data,
    queryFn: () =>
      queryFn({
        query: { page, limit, search: effectiveSearch, ...filtersObj },
        params,
      }),
    staleTime,
  });

  useEffect(() => {
    if (query.error) {
      displayError({ error: query.error, mes: "حدث خطا غير متوقع" });
    }
  }, [query.error]);

  return query;
}
