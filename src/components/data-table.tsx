import * as React from 'react'
import {
  createFilteredRowModel,
  createSortedRowModel,
  flexRender,
  stockFeatures,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type {
  ColumnDef,
  RowData,
  RowSelectionState,
} from '@tanstack/react-table'

import { Checkbox } from './ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

export const dataTableFeatures = tableFeatures({
  ...stockFeatures,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
})

type DataTableFeatures = typeof dataTableFeatures
interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData, unknown>[]
  data: TData[]
  loading?: boolean
  emptyMessage?: string
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void
  getRowId?: (row: TData, index: number) => string
  onRowClick?: (row: TData) => void
  getRowClassName?: (row: TData) => string
  enableRowSelection?: boolean | ((row: TData) => boolean)
  maxRowSelection?: number
  className?: string
  maxHeight?: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  maxHeight,
  loading = false,
  emptyMessage = 'No results found.',
  globalFilter = '',
  onGlobalFilterChange,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  onRowClick,
  getRowClassName,
  enableRowSelection = false,
  maxRowSelection,
  className = 'bg-background rounded-xl ',
}: DataTableProps<TData>) {
  const [internalSelection, setInternalSelection] =
    React.useState<RowSelectionState>({})

  const selection = rowSelection ?? internalSelection

  const updateSelection = React.useCallback(
    (
      updater:
        | RowSelectionState
        | ((previous: RowSelectionState) => RowSelectionState),
    ) => {
      const nextSelection =
        typeof updater === 'function' ? updater(selection) : updater

      if (onRowSelectionChange) {
        onRowSelectionChange(nextSelection)
      } else {
        setInternalSelection(nextSelection)
      }
    },
    [selection, onRowSelectionChange],
  )

  const finalColumns = React.useMemo<
    ColumnDef<DataTableFeatures, TData, unknown>[]
  >(() => {
    if (!enableRowSelection) {
      return columns
    }

    const selectionColumn: ColumnDef<DataTableFeatures, TData, unknown> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(checked) => {
            table.toggleAllPageRowsSelected(checked === true)
          }}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={(checked) => {
            row.toggleSelected(checked === true)
          }}
          aria-label="Select row"
          onClick={(event) => event.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }

    return [selectionColumn, ...columns]
  }, [columns, enableRowSelection])

  const table = useTable({
    key: 'reusable-data-table',
    features: dataTableFeatures,
    data,
    columns: finalColumns,
    state: {
      globalFilter,
      rowSelection: selection,
    },
    onGlobalFilterChange,
    onRowSelectionChange: updateSelection,
    getRowId,
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchValue = String(filterValue ?? '')
        .trim()
        .toLowerCase()

      if (!searchValue) return true

      return row.getAllCells().some((cell) =>
        String(cell.getValue() ?? '')
          .toLowerCase()
          .includes(searchValue),
      )
    },
    enableRowSelection: (row) => {
      if (!enableRowSelection) return false

      const allowed =
        typeof enableRowSelection === 'function'
          ? enableRowSelection(row.original)
          : enableRowSelection

      if (!allowed) return false

      if (maxRowSelection === undefined) {
        return true
      }

      const isAlreadySelected = row.getIsSelected()
      const selectedCount = Object.values(selection).filter(Boolean).length

      return isAlreadySelected || selectedCount < maxRowSelection
    },
    enableRowRangeSelection: false,
  })

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl border">
        <Table maxHeight={maxHeight}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold text-muted-foreground uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={finalColumns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className={[
                    onRowClick ? 'cursor-pointer' : '',
                    getRowClassName?.(row.original) ?? '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={finalColumns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
