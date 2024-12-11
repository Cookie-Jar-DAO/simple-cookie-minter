import { CookieJar } from "@/lib/indexer/db";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useGraphData, UseGraphDataProps } from "./useGraphData";

const columns: ColumnDef<CookieJar>[] = [
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

interface UseJarsTableProps extends UseGraphDataProps {
  filter: string;
}

const useJarsTable = ({ chainId, sorting, filter }: UseJarsTableProps) => {
  const { data, isFetching } = useGraphData({ chainId, sorting });
  const table = useReactTable({
    data: data ?? [],
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
