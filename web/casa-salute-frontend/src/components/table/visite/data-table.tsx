
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
import { SheetVisita } from "@/components/visitSheet";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { SheetTrigger } from "@/components/ui/sheet";
import { Visit } from "@/hooks/type";
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	originalData: Visit[],
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
	const [selectedVisit, setSelectedVisit] = React.useState<Visit | undefined>()
	const table = useReactTable({
		data,
		columns,
		getRowId: originalRow => originalRow.id_visita,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnVisibility: {
				id_visita: false
			},
			sorting,
			columnFilters,
		},
	})
	const visitById = (id_visita: string) => {
		const selected = originalData.filter((visita) => visita.id_visita === id_visita);
		setSelectedVisit(selected[0])
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
				<SheetVisita visita={selectedVisit}>
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
											onClick={() => visitById(row.getValue("id_visita"))}
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
				</SheetVisita>
			</div>
		</div >
	);
}
