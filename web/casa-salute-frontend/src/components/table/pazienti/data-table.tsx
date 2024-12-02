"use client";

import * as React from "react"
import { Input } from "@/components/ui/input"
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { SheetPazienti } from "@/components/pazientiSheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { SheetTrigger } from "@/components/ui/sheet";
import { Paziente } from "@/hooks/type";
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	originalData: Paziente[],
}

export function DataTable<TData, TValue>({
	columns,
	data,
	originalData
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [selectedPaziente, setSelectedPaziente] = React.useState<Paziente | undefined>()
	const table = useReactTable({
		data,
		columns,
		getRowId: originalRow => originalRow.id_paziente,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnVisibility: {
				id_paziente: false
			},
			sorting,
			columnFilters,
		},
	})
	const pazienteById = (id_paziente: string) => {
		const selected = originalData.filter((paziente) => paziente.id_paziente === id_paziente);
		setSelectedPaziente(selected[0])
	};
	return (
		<div>
			<div className="rounded-md border">
				<SheetPazienti paziente={selectedPaziente}>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<SheetTrigger asChild>
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
											className="cursor-pointer"
											onClick={() => pazienteById(row.getValue("id_paziente"))}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									</SheetTrigger>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</SheetPazienti>
			</div>
		</div >
	);
}
