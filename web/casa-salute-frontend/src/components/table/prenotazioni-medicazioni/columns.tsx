
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
export type Prenotazione = {
	data: string;
	timestamp: string;
    tiposala: string;
}

export const columns: ColumnDef<Prenotazione>[] = [
	{
		accessorKey: "data",
		header: ({ column }) => {
			return (
				<Button variant="outline" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>Data visita<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: "timestamp",
		enableHiding: true,
	},
    {
		accessorKey: "tiposala",
		enableHiding: true,
	},
]
