
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
export type Prenotazione = {
	id_medico: string,
	id_tipoambulatorio: string,
	data: string;
	medico: string;
	ambulatorio: string;
	timestamp: string;
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
		accessorKey: "medico",
		header: "Medico curante"
	},
	{
		accessorKey: "ambulatorio",
		header: "Ambulatorio"
	},
	{
		accessorKey: "id_medico",
		enableHiding: true,
	},
	{
		accessorKey: "id_tipoambulatorio",
		enableHiding: true,
	},
	{
		accessorKey: "timestamp",
		enableHiding: true,
	},
]
