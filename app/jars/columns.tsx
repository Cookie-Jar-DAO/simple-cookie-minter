"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { CookieJar } from "@/lib/indexer/db";
import type { Payment } from "./mock-data";
import { parse } from "path";

// export const columns: ColumnDef<CookieJar>[] = [
// 	{
// 		accessorKey: "name",
// 		header: "Name",
// 	},
// 	{
// 		accessorKey: "description",
// 		header: "Description",
// 	},
// 	{
// 		accessorKey: "type",
// 		header: "Type",
// 	},
// ];

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "amount",
		header: () => <div className="text-right">Amount</div>,
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue("amount"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}).format(amount);
			return <div className="text-right">{formatted}</div>;
		},
	},
];
