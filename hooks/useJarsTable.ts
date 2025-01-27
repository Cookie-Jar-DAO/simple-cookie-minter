import { CookieJar } from "@/lib/indexer/db";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { UseGraphDataProps, useGraphData } from "./useGraphData";

interface UseJarsTableProps extends UseGraphDataProps {
  filter: string;
}
const columns: ColumnDef<CookieJar>[] = [
  { accessorKey: "chainId", header: "Chain ID" },
  { accessorKey: "chainId", header: "Chain ID" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "periodLength", header: "Period Length" },
  { accessorKey: "owner", header: "Owner" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "link", header: "Link" },
  { accessorKey: "id", header: "ID" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "cookieToken", header: "Cookie Token" },
  { accessorKey: "cookieAmount", header: "Cookie Amount" },
  { accessorKey: "target", header: "Target" },
  { accessorKey: "chainName", header: "Chain name" },
];

const EMPTY_DATA: CookieJar[] = [];
// ! This whole implementation is a mess, but it works for now. Needs to be refactored.
const useJarsTable = ({ chainId, sorting, filter }: UseJarsTableProps) => {
  const { data: rawData, isFetching } = useGraphData({ chainId, sorting });

  // Filter out undefined values and ensure type safety
  const tableData = useMemo(() => {
    if (!rawData) return EMPTY_DATA;
    // Filter out any undefined values and ensure we have a clean CookieJar array
    return rawData.filter((item): item is CookieJar => item !== undefined);
  }, [rawData]);

  const table = useReactTable<CookieJar>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    autoResetExpanded: false,
    state: {
      globalFilter: filter,
    },
  });
  return { table, isFetching };
};

export default useJarsTable;
