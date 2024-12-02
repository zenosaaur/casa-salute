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
import { SheetMedicazioni } from "@/components/medicazioniSheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { SheetTrigger } from "@/components/ui/sheet";
import { PrelievoMedicazione } from "@/hooks/type";
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	originalData: PrelievoMedicazione[],
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
	const [selectedMedication, setSelectedMedication] = React.useState<PrelievoMedicazione | undefined>()
	const table = useReactTable({
		data,
		columns,
		getRowId: originalRow => originalRow.id_prelievimedicazioni,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnVisibility: {
				id_prelievimedicazioni: false
			},
			sorting,
			columnFilters,
		},
	})
	const medicazioniById = (id_prelievimedicazioni: string) => {
		const selected = originalData.filter((visita) => visita.id_prelievimedicazioni === id_prelievimedicazioni);
		setSelectedMedication(selected[0])
	};
	return (
		<div>
			<div className="flex items-center py-4">
				<Input
					placeholder="Filtra per data..."
					value={(table.getColumn("data")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("data")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>
			<div className="rounded-md border">
				<SheetMedicazioni medicazioni={selectedMedication}>
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
											onClick={() => medicazioniById(row.getValue("id_prelievimedicazioni"))}
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
				</SheetMedicazioni>
			</div>
		</div >
	);
}
