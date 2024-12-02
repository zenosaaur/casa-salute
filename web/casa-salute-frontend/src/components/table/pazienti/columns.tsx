"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
export type Paziente = {
	id_paziente: string;
	nome: string;
	cognome: string;
	codicesanitario: number;
	email: string;
}

export const columns: ColumnDef<Paziente>[] = [
	{
		accessorKey: "id_paziente",
		enableHiding: true,
	},
	{
		accessorKey: "nome",
		header: ({ column }) => {
			return (
				<Button variant="outline" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>Nome<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: "cognome",
		header: ({ column }) => {
			return (
				<Button variant="outline" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>Cognome<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button variant="outline" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>Email<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: "codicesanitario",
		header: "Codice sanitario",
	},
]
