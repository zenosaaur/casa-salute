
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
export type Visita = {
	id_visita: string;
	data: string;
	medico: string;
	esito: string;
}

export const columns: ColumnDef<Visita>[] = [
	{
		accessorKey: "id_visita",
		enableHiding: true,
	},
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
		accessorKey: "esito",
		header: "Esito",
	},
	{
		accessorKey: "ambulatorio",
		header: "Tipo Ambulatorio",
	},
]
