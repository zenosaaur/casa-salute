"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
export type Medication = {
	id_prelievimedicazioni: string;
	data: string;
	infermiere: string;
	esito: string;
}

export const columns: ColumnDef<Medication>[] = [
	{
		accessorKey: "id_prelievimedicazioni",
		enableHiding: true,
	},
	{
		accessorKey: "data",
		header: ({ column }) => {
			return (
				<Button variant="outline" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>Data<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: "infermiere",
		header: "Infermiere"
	},
	{
		accessorKey: "esito",
		header: "Esito",
	},
]
