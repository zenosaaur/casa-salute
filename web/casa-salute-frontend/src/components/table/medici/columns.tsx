"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
export type Medico = {
	id_medico: string;
	nome: string;
	cognome: number;
	codicefiscale: string;
	email: string;
	data_nascita: string;
}
export const columns: ColumnDef<Medico>[] = [
	{
		accessorKey: "id_medico",
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
	}, {
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
		accessorKey: "codicefiscale",
		header: "Codice fiscale",
	},
]
